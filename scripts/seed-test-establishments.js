import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const testEstablishments = [
  {
    name: "Restaurante Paulista",
    slug: "restaurante-paulista",
    category_id: "2138af56-5959-4173-a43e-bfd2b08916a1",
    neighborhood_id: null,
    description: "Autêntica culinária paulista com pratos tradicionais.",
    short_description: "Culinária paulista",
    address: "Rua das Flores, 123 - Santana",
    phone: "(11) 3456-7890",
    whatsapp: "(11) 98765-4321",
    website_url: "https://restaurantepaulista.com.br",
    instagram_url: "https://instagram.com/restaurantepaulista",
    image_cover_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=375&fit=crop",
    has_ifood: true,
    price_range: "$$",
    rating: 4.5,
    status: "published",
    is_featured: true,
    average_ticket: 80,
  },
  {
    name: "O Boteco",
    slug: "o-boteco",
    category_id: "709cc187-0fed-4663-9410-067cf35f183b",
    neighborhood_id: null,
    description: "Bar tradicional com chopp gelado e comida boa.",
    short_description: "Bar tradicional",
    address: "Av. Principal, 456 - Tucuruvi",
    phone: "(11) 3456-1234",
    whatsapp: "(11) 98765-1111",
    website_url: null,
    instagram_url: "https://instagram.com/oboteco",
    image_cover_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=375&fit=crop",
    has_ifood: false,
    price_range: "$",
    rating: 4.2,
    status: "published",
    is_featured: false,
    average_ticket: 40,
  },
  {
    name: "Pizzaria Napoli",
    slug: "pizzaria-napoli",
    category_id: "89961dc6-8ca3-4393-b2ba-72429d9e640f",
    neighborhood_id: null,
    description: "Pizzas artesanais com massa fermentada por 72 horas.",
    short_description: "Pizzas artesanais",
    address: "Rua Roma, 789 - Vila Maria",
    phone: "(11) 3456-5678",
    whatsapp: "(11) 98765-2222",
    website_url: "https://pizzarianapoli.com.br",
    instagram_url: "https://instagram.com/pizzarianapoli",
    image_cover_url: "https://images.unsplash.com/photo-1595521105541-5a86cef825e2?w=500&h=375&fit=crop",
    has_ifood: true,
    price_range: "$$",
    rating: 4.8,
    status: "published",
    is_featured: true,
    average_ticket: 70,
  },
  {
    name: "Padaria do Bairro",
    slug: "padaria-do-bairro",
    category_id: "9d1a4054-d3b9-47df-902c-6d56cc85e64e",
    neighborhood_id: null,
    description: "Pão francês quente todos os dias, bolos caseiros.",
    short_description: "Pão quente e bolos",
    address: "Rua Centro, 101 - Casa Verde",
    phone: "(11) 3456-9999",
    whatsapp: "(11) 98765-3333",
    website_url: null,
    instagram_url: null,
    image_cover_url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=375&fit=crop",
    has_ifood: false,
    price_range: "$",
    rating: 4.6,
    status: "published",
    is_featured: false,
    average_ticket: 25,
  },
];

async function seed() {
  try {
    console.log("🌱 Iniciando seeding de estabelecimentos de teste...");

    // Primeiro, verifica/cria as categorias
    const categories = ["restaurantes", "bares", "pizzarias", "padarias"];
    
    for (const cat of categories) {
      const { data: existing } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", cat)
        .single();

      if (!existing) {
        await supabase
          .from("categories")
          .insert({
            name: cat.charAt(0).toUpperCase() + cat.slice(1),
            slug: cat,
            description: `Categoria de ${cat}`,
          });
        console.log(`✓ Categoria "${cat}" criada`);
      }
    }

    // Insere os estabelecimentos
    const { data, error } = await supabase
      .from("establishments")
      .insert(testEstablishments)
      .select();

    if (error) {
      console.error("❌ Erro ao inserir estabelecimentos:", error);
      process.exit(1);
    }

    console.log(`✓ ${data.length} estabelecimentos inseridos com sucesso!`);
    console.log("✓ Seeding concluído!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erro:", err);
    process.exit(1);
  }
}

seed();
