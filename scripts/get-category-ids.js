import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getCategoryIds() {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, slug");

    if (error) {
      console.error("Erro:", error);
      process.exit(1);
    }

    console.log("Categorias encontradas:");
    data.forEach(cat => {
      console.log(`  ${cat.slug}: ${cat.id}`);
    });

    process.exit(0);
  } catch (err) {
    console.error("Erro:", err);
    process.exit(1);
  }
}

getCategoryIds();
