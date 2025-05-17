
import { supabase } from "@/lib/supabaseClient"

export async function uploadImageToSupabase(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `${fileName}`

  const { error } = await supabase.storage
    .from("productos")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

  if (error) {
    console.error("Error subiendo imagen:", error)
    return null
  }

  // Obtener URL pública
  const { data } = supabase.storage.from("productos").getPublicUrl(filePath)
  return data.publicUrl
}
