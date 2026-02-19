import { supabase } from '@/lib/supabase';

const MAX_RETRIES = 5;

/**
 * Safely updates the 'content' JSON column of a card by handling race conditions.
 * Uses optimistic locking via the 'updated_at' timestamp if available.
 * 
 * @param cardId The ID of the card to update.
 * @param updateFn A function that takes the current content and returns the modified content.
 */
export async function updateCardContent(cardId: string, updateFn: (content: any) => any) {
    let attempts = 0;

    while (attempts < MAX_RETRIES) {
        attempts++;
        try {
            // 1. Fetch current content and lock-version (updated_at)
            const { data, error } = await supabase
                .from('cards')
                .select('content, updated_at')
                .eq('id', cardId)
                .single();

            if (error || !data) {
                // If it's a "column not found" error for updated_at, fallback to unsafe update?
                // But for now we treat any fetch error as fatal or worthy of retry if transient.
                if (error && error.code === 'PGRST100') { // Column not found potentially
                    console.warn("updated_at column might be missing, falling back to simple update");
                    // Fallback logic could go here, but let's throw for now to see in logs if we want strictness.
                    // Or just Proceed without lock-check?
                    // Let's assume updated_at exists for standard Supabase tables.
                }
                throw error || new Error('Card not found');
            }

            const currentContent = data.content || {};
            const currentUpdatedAt = data.updated_at;

            // 2. Apply modifications
            const newContent = updateFn(JSON.parse(JSON.stringify(currentContent))); // Deep clone to be safe

            // 3. Attempt atomic update
            let updateQuery = supabase
                .from('cards')
                .update({
                    content: newContent,
                    updated_at: new Date().toISOString() // Manually advance updated_at to ensure change
                })
                .eq('id', cardId);

            // Optimistic Lock: Only update if updated_at hasn't changed since our read
            if (currentUpdatedAt) {
                updateQuery = updateQuery.eq('updated_at', currentUpdatedAt);
            }

            const { data: updateData, error: updateError, count } = await updateQuery.select(); // Select to see if row was returned

            if (updateError) throw updateError;

            // If count is 0, it means the row was modified in between (updated_at mismatch)
            // or the row was deleted. We assume modification and retry.
            // Note: .select() combined with .update() returns the rows. 
            // If strictly using REST, 'count' might need 'return=representation' header or similar which select() implies.

            if (!updateData || updateData.length === 0) {
                // Concurrency collision occurred
                // Add random jitter before retry
                const jitter = Math.floor(Math.random() * 200) + 50;
                await new Promise(r => setTimeout(r, jitter));
                continue;
            }

            // Success
            return { success: true, data: updateData };

        } catch (err) {
            console.error(`Attempt ${attempts} failed to update card content:`, err);
            if (attempts === MAX_RETRIES) throw err;
            const jitter = Math.floor(Math.random() * 200) + 50;
            await new Promise(r => setTimeout(r, jitter));
        }
    }
}
