'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const fullName = formData.get('fullName') as string
    const brandName = formData.get('brandName') as string
    const phone = formData.get('phone') as string

    if (!fullName || !brandName) {
        return { error: 'Full name and brand name are required' }
    }

    const { error } = await supabase
        .from('profiles')
        .update({
            full_name: fullName,
            brand_name: brandName,
            phone: phone,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

    if (error) {
        console.error('Error updating profile:', error)
        return { error: 'Failed to update profile' }
    }

    revalidatePath('/settings')
    revalidatePath('/', 'layout') // Revalidate header
    return { success: 'Profile updated successfully' }
}
