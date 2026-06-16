import type { AppLocale } from "@/i18n/routing";
import type { ProductDetail, ProductListItem } from "@/types/product";

type LocalizedProductCopy = {
  name: string;
  shortDescription: string;
  description: string;
  specifications: string[];
};

const productTranslations: Record<
  string,
  Partial<Record<Exclude<AppLocale, "es">, LocalizedProductCopy>>
> = {
  "Labial Mate Rosa Nude": {
    en: {
      name: "Nude Pink Matte Lipstick",
      shortDescription: "Long-lasting lipstick with a matte finish.",
      description:
        "Matte lipstick with a smooth texture, high pigmentation and long-lasting wear, ideal for everyday use.",
      specifications: [
        "Matte finish",
        "Nude pink shade",
        "Long-lasting wear",
        "Contents: 4 g",
      ],
    },
    pt: {
      name: "Batom Matte Rosa Nude",
      shortDescription: "Batom de longa duracao com acabamento matte.",
      description:
        "Batom matte com textura suave, alta pigmentacao e longa duracao, ideal para o uso diario.",
      specifications: [
        "Acabamento matte",
        "Tom rosa nude",
        "Longa duracao",
        "Conteudo: 4 g",
      ],
    },
  },
  "Serum Facial Hidratante": {
    en: {
      name: "Hydrating Facial Serum",
      shortDescription: "Lightweight serum for hydration and radiance.",
      description:
        "Facial serum with a lightweight texture, designed to hydrate the skin, improve radiance and leave a fresh feeling.",
      specifications: [
        "Lightweight texture",
        "Daily use",
        "Suitable for all skin types",
        "Contents: 30 ml",
      ],
    },
    pt: {
      name: "Serum Facial Hidratante",
      shortDescription: "Serum leve para hidratar e dar luminosidade.",
      description:
        "Serum facial de textura leve, desenvolvido para hidratar a pele, melhorar a luminosidade e proporcionar uma sensacao refrescante.",
      specifications: [
        "Textura leve",
        "Uso diario",
        "Adequado para todos os tipos de pele",
        "Conteudo: 30 ml",
      ],
    },
  },
  "Crema Hidratante Facial": {
    en: {
      name: "Facial Moisturizing Cream",
      shortDescription: "Facial cream for daily hydration.",
      description:
        "Fast-absorbing facial moisturizer, ideal for keeping skin soft, fresh and protected throughout the day.",
      specifications: [
        "Fast absorption",
        "Daily use",
        "Soft texture",
        "Contents: 50 ml",
      ],
    },
    pt: {
      name: "Creme Hidratante Facial",
      shortDescription: "Creme facial para hidratacao diaria.",
      description:
        "Creme hidratante facial de rapida absorcao, ideal para manter a pele macia, fresca e protegida durante o dia.",
      specifications: [
        "Rapida absorcao",
        "Uso diario",
        "Textura suave",
        "Conteudo: 50 ml",
      ],
    },
  },
  "Perfume Floral Elegance": {
    en: {
      name: "Floral Elegance Perfume",
      shortDescription: "Women's perfume with a soft floral scent.",
      description:
        "Women's perfume with floral and sweet notes, ideal for everyday wear or special occasions.",
      specifications: [
        "Floral scent",
        "Medium-lasting wear",
        "Elegant presentation",
        "Contents: 100 ml",
      ],
    },
    pt: {
      name: "Perfume Floral Elegance",
      shortDescription: "Perfume feminino com aroma floral suave.",
      description:
        "Perfume feminino com notas florais e doces, ideal para o uso diario ou ocasioes especiais.",
      specifications: [
        "Aroma floral",
        "Duracao media",
        "Apresentacao elegante",
        "Conteudo: 100 ml",
      ],
    },
  },
  "Protector Solar Facial SPF 50": {
    en: {
      name: "SPF 50 Facial Sunscreen",
      shortDescription: "High-protection facial sunscreen.",
      description:
        "SPF 50 facial sunscreen with a lightweight texture, ideal for protecting the skin from the sun without a greasy feel.",
      specifications: [
        "SPF 50",
        "Lightweight texture",
        "Non-greasy",
        "Contents: 50 ml",
      ],
    },
    pt: {
      name: "Protetor Solar Facial FPS 50",
      shortDescription: "Protetor solar facial de alta protecao.",
      description:
        "Protetor solar facial FPS 50 com textura leve, ideal para proteger a pele do sol sem sensacao oleosa.",
      specifications: [
        "FPS 50",
        "Textura leve",
        "Nao oleoso",
        "Conteudo: 50 ml",
      ],
    },
  },
};

function getLocalizedCopy(name: string, locale: AppLocale) {
  if (locale === "es") {
    return null;
  }

  return productTranslations[name]?.[locale] ?? null;
}

export function localizeProductListItem<T extends ProductListItem>(
  product: T,
  locale: AppLocale
): T {
  const localizedCopy = getLocalizedCopy(product.name, locale);

  if (!localizedCopy) {
    return product;
  }

  return {
    ...product,
    name: localizedCopy.name,
    shortDescription: localizedCopy.shortDescription,
  };
}

export function localizeProductDetail<T extends ProductDetail>(
  product: T,
  locale: AppLocale
): T {
  const localizedCopy = getLocalizedCopy(product.name, locale);

  if (!localizedCopy) {
    return product;
  }

  return {
    ...product,
    name: localizedCopy.name,
    shortDescription: localizedCopy.shortDescription,
    description: localizedCopy.description,
    specifications: localizedCopy.specifications,
  };
}
