<template>
  <NuxtLayout name="user">
    <section class="space-y-12">
      <div class="space-y-8">
        <div
          v-if="pending"
          class="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
        >
          <USkeleton v-for="index in 8" :key="index" class="h-64 rounded-3xl" />
        </div>

        <div v-else>
          <div v-if="activeCategory === 'todos'">
            <div v-for="group in groupedDishes" :key="group.slug" class="mb-8">
              <h2 class="text-2xl font-bold mb-4">{{ group.name }}</h2>
              <div class="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                <UCard
                  v-for="dish in group.dishes"
                  :key="dish.id"
                  class="group flex flex-row lg:flex-col overflow-hidden border-0 shadow-lg shadow-gray-200/60 transition hover:-translate-y-1 hover:shadow-orange-200/60"
                >
                  <div class="flex flex-row lg:flex-col">
                    <div
                      class="relative w-20 lg:w-full lg:h-40 overflow-hidden rounded-lg lg:rounded-none"
                    >
                      <nuxt-img
                        :src="formatImage(dish.image)"
                        :alt="dish.name"
                        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <!-- <span
                    class="absolute left-1 top-1 lg:left-4 lg:top-4 rounded-full bg-white/90 px-1.5 py-0.5 lg:px-3 lg:py-1 text-xs font-semibold text-gray-700"
                  >
                    {{ primaryCategoryLabel(dish) }}
                  </span> -->
                    </div>
                    <div class="flex flex-1 flex-col gap-2 p-3 lg:py-3">
                      <div class="flex items-start justify-between gap-4">
                        <h3
                          class="text-base lg:text-lg font-semibold text-gray-900"
                        >
                          {{ dish.name }}
                        </h3>
                      </div>
                      <p class="text-xs lg:text-sm text-gray-500 line-clamp-2">
                        {{ dish.description }}
                      </p>
                      <span class="text-sm lg:text-lg font-bold text-primary">{{
                        currencyFormatter.format(dish.price)
                      }}</span>
                      <UButton
                        size="sm"
                        icon="i-heroicons-plus"
                        class="mt-auto w-full lg:w-max"
                        @click="openDishModal(dish)"
                      >
                        Adicionar a sacola
                      </UButton>
                    </div>
                  </div>
                </UCard>
              </div>
            </div>
          </div>

          <div
            v-else-if="filteredDishes.length"
            class="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
          >
            <UCard
              v-for="dish in filteredDishes"
              :key="dish.id"
              class="group flex flex-row lg:flex-col overflow-hidden border-0 shadow-lg shadow-gray-200/60 transition hover:-translate-y-1 hover:shadow-orange-200/60"
            >
              <div class="flex flex-row lg:flex-col">
                <div
                  class="relative w-20 lg:w-full lg:h-40 overflow-hidden rounded-lg lg:rounded-none"
                >
                  <nuxt-img
                    :src="formatImage(dish.image)"
                    :alt="dish.name"
                    class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <!-- <span
                    class="absolute left-1 top-1 lg:left-4 lg:top-4 rounded-full bg-white/90 px-1.5 py-0.5 lg:px-3 lg:py-1 text-xs font-semibold text-gray-700"
                  >
                    {{ primaryCategoryLabel(dish) }}
                  </span> -->
                </div>
                <div class="flex flex-1 flex-col gap-2 p-3 lg:py-3">
                  <div class="flex items-start justify-between gap-4">
                    <h3
                      class="text-base lg:text-lg font-semibold text-gray-900"
                    >
                      {{ dish.name }}
                    </h3>
                  </div>
                  <p class="text-xs lg:text-sm text-gray-500 line-clamp-2">
                    {{ dish.description }}
                  </p>
                  <span class="text-sm lg:text-lg font-bold text-primary">{{
                    currencyFormatter.format(dish.price)
                  }}</span>
                  <UButton
                    size="sm"
                    icon="i-heroicons-plus"
                    class="mt-auto w-full lg:w-max"
                    @click="handleDishClick(dish)"
                  >
                    Adicionar a sacola
                  </UButton>
                </div>
              </div>
            </UCard>
          </div>

          <div v-else class="space-y-8">
            <div
              class="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm"
            >
              <UIcon
                name="i-heroicons-face-smile"
                class="mx-auto h-16 w-16 text-orange-400"
              />
              <h3 class="mt-4 text-2xl font-semibold text-gray-900">
                Ainda estamos preparando esse menu
              </h3>
              <p class="mt-2 text-sm text-gray-500">
                Enquanto novos itens chegam, aproveite nossas sugestões
                especiais selecionadas pelo chef.
              </p>
            </div>
            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <UCard
                v-for="dish in suggestionDishes"
                :key="dish.id"
                class="flex flex-col overflow-hidden border-0 shadow-md shadow-gray-200/80"
              >
                <div class="relative h-36 overflow-hidden">
                  <nuxt-img
                    :src="formatImage(dish.image)"
                    :alt="dish.name"
                    class="h-full w-full object-cover"
                  />
                </div>
                <div class="flex flex-1 flex-col gap-3 p-5">
                  <div class="flex items-start justify-between gap-3">
                    <h4 class="text-base font-semibold text-gray-900">
                      {{ dish.name }}
                    </h4>
                    <span class="text-sm font-bold text-primary">{{
                      currencyFormatter.format(dish.price)
                    }}</span>
                  </div>
                  <p class="text-xs text-gray-500">{{ dish.description }}</p>
                  <UButton
                    size="sm"
                    variant="soft"
                    icon="i-heroicons-plus"
                    class="mt-auto w-max"
                    @click="handleDishClick(dish)"
                  >
                    Escolher prato
                  </UButton>
                </div>
              </UCard>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <Transition
        enter-active-class="duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isDishModalOpen && activeDish"
          ref="modalWrapperRef"
          class="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6"
          tabindex="-1"
          @keydown.esc="closeDishModal"
        >
          <div
            class="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            @click="closeDishModal"
          ></div>

          <div class="relative z-10 w-full max-w-2xl">
            <div
              class="flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[calc(100vh-3rem)]"
            >
              <!-- Close Button - Top Right -->
              <button
                type="button"
                class="absolute cursor-pointer right-4 top-4 inline-flex h-9 w-9 text-white items-center justify-center rounded-full bg-primary z-[300] shadow-lg"
                @click="closeDishModal"
              >
                <UIcon name="i-heroicons-x-mark" class="h-5 w-5" />
              </button>

              <!-- Header: Image + Title Row -->
              <div class="flex gap-4 p-6 pb-4 border-b border-slate-200">
                <!-- Image -->
                <div
                  class="flex-shrink-0 w-24 h-24 overflow-hidden rounded-lg bg-slate-100"
                >
                  <nuxt-img
                    :src="formatImage(activeDish.image)"
                    :alt="activeDish.name"
                    class="h-full w-full object-cover"
                  />
                </div>

                <!-- Title & Price -->
                <div class="flex-1 min-w-0">
                  <h3 class="text-xl font-bold text-slate-900 mb-1">
                    {{ activeDish.name }}
                  </h3>
                  <p
                    v-if="activeDish.description"
                    class="text-sm text-slate-500 mb-2 line-clamp-2"
                  >
                    {{ activeDish.description }}
                  </p>
                  <p class="text-base font-semibold text-primary">
                    A partir de {{ currencyFormatter.format(activeDish.price) }}
                  </p>
                </div>
              </div>

              <!-- Scrollable Content: Sides -->
              <div
                v-if="!activeDish.stock"
                class="flex-1 overflow-y-auto thin-scrollbar"
              >
                <div
                  v-if="activeDishCategories.length > 0"
                  class="space-y-4 p-6"
                >
                  <section
                    v-for="category in activeDishCategories"
                    :key="category.id"
                    class="overflow-hidden"
                  >
                    <div
                      class="flex bg-gray-100 items-start justify-between gap-3 px-4 py-3 rounded-t-lg"
                    >
                      <div class="space-y-1 text-sm">
                        <p class="text-sm font-semibold text-slate-900">
                          {{ category.name }}
                        </p>
                        <template v-if="category.maxSelections">
                          <span
                            >{{ selectionCount(category.id) }} /
                            {{ category.maxSelections }}</span
                          >
                        </template>
                        <template v-else>
                          <span>Escolha livre</span>
                        </template>
                      </div>
                      <div
                        class="flex flex-col items-end gap-1 text-xs font-medium text-slate-500"
                      >
                        <span
                          v-if="category.isRequired"
                          class="rounded-full bg-orange-100 px-2 py-0.5 text-orange-700"
                        >
                          OBRIGATÓRIO
                        </span>
                        <span
                          v-else
                          class="rounded-full bg-slate-100 px-2 py-0.5"
                        >
                          OPCIONAL
                        </span>
                      </div>
                    </div>
                    <ul
                      class="divide-y divide-slate-200 border border-gray-100 rounded-b-lg"
                    >
                      <li v-for="option in category.sides" :key="option.id">
                        <button
                          type="button"
                          :disabled="isOptionDisabled(category, option)"
                          :class="[
                            'flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition',
                            isOptionSelected(category, option)
                              ? 'bg-orange-50'
                              : 'bg-white',
                            option.isAvailable ? 'hover:bg-orange-50/60' : '',
                            !option.isAvailable
                              ? 'cursor-not-allowed opacity-50'
                              : '',
                            isOptionDisabled(category, option) &&
                            !isOptionSelected(category, option)
                              ? 'cursor-not-allowed opacity-60'
                              : '',
                          ]"
                          @click="toggleSideSelection(category, option)"
                        >
                          <div class="flex items-center gap-3">
                            <div
                              class="h-12 w-12 overflow-hidden rounded-lg bg-slate-100"
                            >
                              <nuxt-img
                                v-if="option.image"
                                :src="formatImage(option.image)"
                                :alt="option.name"
                                class="h-full w-full object-cover"
                              />
                              <div
                                v-else
                                class="flex h-full w-full items-center justify-center"
                              >
                                <UIcon
                                  name="i-heroicons-photo"
                                  class="h-6 w-6 text-slate-400"
                                />
                              </div>
                            </div>
                            <div class="space-y-1">
                              <p class="text-sm font-medium text-slate-900">
                                {{ option.name }}
                              </p>
                              <p
                                v-if="option.description"
                                class="text-xs text-slate-500"
                              >
                                {{ option.description }}
                              </p>
                            </div>
                          </div>
                          <div class="flex items-center gap-3">
                            <span
                              v-if="option.priceIncrement"
                              class="text-sm font-semibold text-slate-700"
                            >
                              {{ formatSideIncrement(option.priceIncrement) }}
                            </span>
                            <div
                              :class="[
                                'flex h-5 w-5 items-center justify-center rounded-full border-2 transition',
                                isOptionSelected(category, option)
                                  ? 'border-primary bg-primary'
                                  : 'border-slate-300',
                              ]"
                            >
                              <UIcon
                                v-if="isOptionSelected(category, option)"
                                name="i-heroicons-check"
                                class="h-3 w-3 text-white"
                              />
                            </div>
                          </div>
                        </button>
                      </li>
                    </ul>
                    <p
                      v-if="
                        category.isRequired && selectionCount(category.id) === 0
                      "
                      class="px-4 pt-2 text-xs font-semibold text-red-500"
                    >
                      Selecione ao menos uma opção.
                    </p>
                  </section>
                </div>
              </div>

              <!-- Footer: Total & Add Button -->
              <div class="border-t border-slate-200 px-6 py-4 bg-slate-50">
                <div class="flex items-center justify-between gap-4">
                  <div class="space-y-1">
                    <p
                      class="text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Total estimado
                    </p>
                    <p class="text-2xl font-bold text-slate-900">
                      {{ currencyFormatter.format(dishTotalPrice) }}
                    </p>
                  </div>
                  <UButton
                    size="lg"
                    class="flex-shrink-0"
                    :disabled="!canConfirmSelection"
                    @click="addDishToCart"
                  >
                    Adicionar a sacola
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { CartItem } from "~/stores/cart";
import { useCartStore } from "~/stores/cart";

interface SideOption {
  id: string;
  name: string;
  description?: string | null;
  priceIncrement: number;
  image?: string | null;
  isAvailable: boolean;
}

interface SideCategory {
  id: string;
  name: string;
  description?: string | null;
  isRequired: boolean;
  maxSelections?: number | null;
  order: number;
  sides: SideOption[];
}

interface DishCategoryTag {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

interface Dish {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image: string | null;
  sideCategories: SideCategory[];
  categories: DishCategoryTag[];
  stock?: number;
  isProduct?: boolean;
}

const placeholderImage =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80";

const baseSideCategories: SideCategory[] = [
  {
    id: "side-cat-1",
    name: "Feijões",
    description: "Escolha um feijão para acompanhar o prato principal.",
    isRequired: true,
    maxSelections: 1,
    order: 0,
    sides: [
      {
        id: "side-opt-1",
        name: "Feijão preto cremoso",
        description: "Tradicional brasileiro cozido lentamente.",
        priceIncrement: 0,
        isAvailable: true,
      },
      {
        id: "side-opt-2",
        name: "Feijão carioca leve",
        description: "Tempero suave com louro e bacon crocante.",
        priceIncrement: 0,
        isAvailable: true,
      },
      {
        id: "side-opt-3",
        name: "Feijão verde nordestino",
        description: "Finalizado com nata e cheiro-verde.",
        priceIncrement: 4.5,
        isAvailable: true,
      },
    ],
  },
  {
    id: "side-cat-2",
    name: "Guarnições",
    description: "Selecione até duas guarnições para completar o prato.",
    isRequired: true,
    maxSelections: 2,
    order: 1,
    sides: [
      {
        id: "side-opt-4",
        name: "Arroz branco soltinho",
        priceIncrement: 0,
        isAvailable: true,
      },
      {
        id: "side-opt-5",
        name: "Farofa crocante de manteiga",
        priceIncrement: 1.5,
        isAvailable: true,
      },
      {
        id: "side-opt-6",
        name: "Purê de batata baroa",
        priceIncrement: 3,
        isAvailable: true,
      },
      {
        id: "side-opt-7",
        name: "Cuscuz nordestino",
        priceIncrement: 2,
        isAvailable: true,
      },
    ],
  },
  {
    id: "side-cat-3",
    name: "Complementos especiais",
    description: "Adicione complementos para elevar a experiência.",
    isRequired: false,
    maxSelections: 3,
    order: 2,
    sides: [
      {
        id: "side-opt-8",
        name: "Vinagrete clássico",
        priceIncrement: 0,
        isAvailable: true,
      },
      {
        id: "side-opt-9",
        name: "Queijo coalho grelhado",
        priceIncrement: 5.5,
        isAvailable: true,
      },
      {
        id: "side-opt-10",
        name: "Banana da terra caramelizada",
        priceIncrement: 3.5,
        isAvailable: true,
      },
    ],
  },
];

const cloneSideCategories = (
  categories: SideCategory[] = baseSideCategories
): SideCategory[] =>
  categories.map((category) => ({
    ...category,
    sides: category.sides.map((side) => ({ ...side })),
  }));

const categoryLabels: Record<string, string> = {
  entradas: "Entradas",
  "pratos-principais": "Pratos Principais",
  sobremesas: "Sobremesas",
  bebidas: "Bebidas",
  destaques: "Destaques do Chef",
  vegetariano: "Opções Vegetarianas",
};

const formatCategoryLabel = (slug: string) =>
  categoryLabels[slug] ??
  slug
    .split("-")
    .filter((segment) => segment.length)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

const buildDishCategories = (slugs: string[]): DishCategoryTag[] =>
  slugs.map((slug) => ({
    id: slug,
    slug,
    name: formatCategoryLabel(slug),
    description: null,
  }));

const defaultDishes: Dish[] = [
  {
    id: "default-1",
    name: "Risoto de Cogumelos Frescos",
    description:
      "Caldo artesanal, arroz arbóreo e mix de cogumelos flambados no vinho branco.",
    price: 54.9,
    category: "pratos-principais",
    categories: buildDishCategories([
      "pratos-principais",
      "destaques",
      "vegetariano",
    ]),
    image:
      "https://images.unsplash.com/photo-1447078806655-40579c2520d6?auto=format&fit=crop&w=1200&q=80",
    sideCategories: cloneSideCategories(),
  },
  {
    id: "default-2",
    name: "Filé Mignon ao Molho Roti",
    description:
      "Corte alto grelhado no ponto perfeito, acompanha purê de batatas trufado.",
    price: 72.5,
    category: "pratos-principais",
    categories: buildDishCategories(["pratos-principais", "destaques"]),
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
    sideCategories: cloneSideCategories(),
  },
  {
    id: "default-3",
    name: "Bruschetta Mediterrânea",
    description:
      "Pão italiano artesanal, tomate confitado, pesto de manjericão e lascas de parmesão.",
    price: 24.9,
    category: "entradas",
    categories: buildDishCategories(["entradas", "vegetariano"]),
    image:
      "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?auto=format&fit=crop&w=1200&q=80",
    sideCategories: cloneSideCategories(),
  },
  {
    id: "default-4",
    name: "Cheesecake de Frutas Vermelhas",
    description:
      "Base de biscoito amanteigado, cream cheese leve e coulis de frutas vermelhas.",
    price: 26.5,
    category: "sobremesas",
    categories: buildDishCategories(["sobremesas", "destaques"]),
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
    sideCategories: cloneSideCategories(),
  },
  {
    id: "default-5",
    name: "Tartar de Salmão com Avocado",
    description:
      "Cubos de salmão fresco, avocado temperado e crocante de nori.",
    price: 39.9,
    category: "entradas",
    categories: buildDishCategories(["entradas", "destaques"]),
    image:
      "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=1200&q=80",
    sideCategories: cloneSideCategories(),
  },
  {
    id: "default-6",
    name: "Nhoque de Batata Baroa",
    description:
      "Molho de ragu de ossobuco cozido por 6 horas e finalizado com gremolata.",
    price: 58.9,
    category: "pratos-principais",
    categories: buildDishCategories(["pratos-principais"]),
    image:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=80",
    sideCategories: cloneSideCategories(),
  },
  {
    id: "default-7",
    name: "Crème Brûlée de Baunilha",
    description:
      "Creme parisiense aveludado com cobertura crocante maçaricada na hora.",
    price: 22.9,
    category: "sobremesas",
    categories: buildDishCategories(["sobremesas"]),
    image:
      "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&w=1200&q=80",
    sideCategories: cloneSideCategories(),
  },
  // {
  //   id: "default-8",
  //   name: "Suco Detox Citrus",
  //   description:
  //     "Laranja, limão siciliano, hortelã e toque de gengibre extra refrescante.",
  //   price: 14.9,
  //   category: "bebidas",
  //   categories: buildDishCategories(["bebidas", "vegetariano"]),
  //   image:
  //     "https://images.unsplash.com/photo-1527169402691-feff5539e52c?auto=format&fit=crop&w=1200&q=80",
  //   sideCategories: cloneSideCategories(),
  // },
];

const highlightCards = [
  {
    title: "Combos assinados pelo chef",
    description:
      "Menus completos com entrada, prato principal e sobremesa prontos para compartilhar.",
    tag: "Sugestão do chef",
    icon: "i-heroicons-fire",
    cta: "Ver combos exclusivos",
  },
  {
    title: "Promoções para hoje à noite",
    description:
      "Seleção de pratos com descontos progressivos para pedidos acima de R$ 80.",
    tag: "Oferta relâmpago",
    icon: "i-heroicons-clock",
    cta: "Explorar ofertas",
  },
  {
    title: "Favoritos da comunidade",
    description:
      "Descubra os pratos mais pedidos e bem avaliados pelos nossos clientes.",
    tag: "Mais populares",
    icon: "i-heroicons-heart",
    cta: "Conhecer favoritos",
  },
];

const normalizeSideOptions = (options: unknown[]): SideOption[] =>
  Array.isArray(options)
    ? options
        .filter(
          (option): option is Record<string, unknown> =>
            option !== null && typeof option === "object"
        )
        .map((option) => ({
          id: String(option.id ?? ""),
          name: String(option.name ?? ""),
          description:
            typeof option.description === "string" ? option.description : null,
          priceIncrement:
            typeof option.priceIncrement === "number"
              ? option.priceIncrement
              : Number(option.priceIncrement ?? 0),
          image:
            typeof option.image === "string" && option.image.length
              ? option.image
              : null,
          isAvailable:
            typeof option.isAvailable === "boolean" ? option.isAvailable : true,
        }))
    : [];

const normalizeSideCategories = (categories: unknown[]): SideCategory[] =>
  Array.isArray(categories)
    ? categories
        .filter(
          (category): category is Record<string, unknown> =>
            category !== null && typeof category === "object"
        )
        .map((category, index) => {
          const rawOrder = category.order;
          const rawMax = category.maxSelections;

          return {
            id: String(category.id ?? index),
            name: String(category.name ?? ""),
            description:
              typeof category.description === "string"
                ? category.description
                : null,
            isRequired: Boolean(category.isRequired),
            maxSelections:
              typeof rawMax === "number"
                ? rawMax
                : rawMax === null
                  ? null
                  : null,
            order:
              typeof rawOrder === "number"
                ? rawOrder
                : typeof rawOrder === "string" && rawOrder.trim().length
                  ? Number(rawOrder)
                  : index,
            sides: normalizeSideOptions(category.sides),
          } as SideCategory;
        })
        .sort((a, b) => a.order - b.order)
    : [];

const { data: fetchedSideCategories, refresh: refreshSideCategories } =
  await useAsyncData<SideCategory[]>("landing-side-categories", async () => {
    try {
      const response = await $fetch<{ success: boolean; data?: unknown[] }>(
        "/api/side-categories"
      );
      if (Array.isArray(response?.data)) {
        return normalizeSideCategories(response.data);
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch side categories:", error);
      return [];
    }
  });

const sharedSideCategories = computed<SideCategory[]>(() => {
  if (fetchedSideCategories.value && fetchedSideCategories.value.length) {
    return fetchedSideCategories.value;
  }
  return baseSideCategories;
});

const cartStore = useCartStore();
const cartEditRequest = useState<string | null>("cartEditRequest", () => null);

const heroMetrics = [
  { label: "Tempo médio de entrega", value: "35 min" },
  { label: "Avaliação dos clientes", value: "4,9/5" },
  { label: "Pedidos hoje", value: "128+" },
];

const heroImage =
  "https://images.unsplash.com/photo-1528697203043-733dafdaa316?auto=format&fit=crop&w=1600&q=80";

const activeCategory = useState<string>("activeCategory", () => "todos");
const searchQuery = useState<string>("menuSearch", () => "");

const { data: fetchedDishes, pending } = await useAsyncData<Dish[]>(
  "landing-dishes",
  async () => {
    try {
      const response = await $fetch<{ success: boolean; data?: Dish[] }>(
        "/api/dishes"
      );
      if (Array.isArray(response?.data) && response.data.length) {
        return [...response.data, ...defaultDishes];
      }
      return [];
    } catch {
      return [];
    }
  }
);

// Fetch products
const { data: fetchedProducts } = await useAsyncData<any[]>(
  "landing-products",
  async () => {
    try {
      const response = await $fetch<{ success: boolean; data?: any[] }>(
        "/api/products?activeOnly=true"
      );
      if (Array.isArray(response?.data)) {
        return response.data;
      }
      return [];
    } catch {
      return [];
    }
  }
);

const { data: fetchedCategories } = await useAsyncData<any[]>(
  "landing-categories",
  async () => {
    try {
      const response = await $fetch<{ success: boolean; data?: any[] }>(
        "/api/categories"
      );
      if (Array.isArray(response?.data)) {
        return response.data;
      }
      return [];
    } catch {
      return [];
    }
  }
);

const getCategoryName = (id: string) => {
  const category = fetchedCategories.value?.find((c) => c.id === id);
  return category ? category.name : "Outros";
};

const getCategorySlug = (id: string) => {
  const category = fetchedCategories.value?.find((c) => c.id === id);
  return category ? category.slug : "outros";
};

const normalizeProduct = (product: any): Dish => {
  const categoryName = getCategoryName(product.category_id);
  const categorySlug = getCategorySlug(product.category_id);

  let sideCategories: any[] = [];
  if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
    sideCategories.push({
      id: `variants-${product.id}`,
      name: "Variantes",
      description: "Escolha uma opção",
      isRequired: false,
      maxSelections: 1,
      order: 0,
      sides: product.variants.map((v: any, index: number) => ({
        id: `variant-${product.id}-${index}`,
        name: v.name,
        description: null,
        priceIncrement: Number(v.additional_price) || 0,
        image: null,
        isAvailable: v.is_active !== false
      }))
    });
  }

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.sell_price,
    category: categorySlug,
    image: product.image,
    sideCategories: sideCategories,
    categories: [
      {
        id: categorySlug,
        slug: categorySlug,
        name: categoryName,
        description: null,
      },
    ],
    stock: product.quantity,
    isProduct: true,
  } as Dish;
};

const normalizeDish = (dish: Dish): Dish => {
  const normalizedCategories =
    Array.isArray(dish.categories) && dish.categories.length
      ? dish.categories.map((category) => {
          const slug = category.slug ?? category.id ?? "especiais";
          return {
            id: slug,
            slug,
            name: category.name ?? formatCategoryLabel(slug),
            description: category.description ?? null,
          };
        })
      : buildDishCategories([dish.category]);

  return {
    ...dish,
    categories: normalizedCategories,
  };
};

const dishes = computed<Dish[]>(() => {
  let allItems: Dish[] = [];

  if (fetchedDishes.value && fetchedDishes.value.length) {
    allItems = [...allItems, ...fetchedDishes.value.map(normalizeDish)];
  } else {
    allItems = [...allItems, ...defaultDishes.map(normalizeDish)];
  }

  if (fetchedProducts.value && fetchedProducts.value.length) {
    allItems = [...allItems, ...fetchedProducts.value.map(normalizeProduct)];
  }
  }

  return allItems;
});

const categoriesState = useState<{ id: string; name: string }[]>(
  "menuCategories",
  () => [{ id: "todos", name: "Todos" }]
);

const dishMatchesCategory = (dish: Dish, categoryId: string) => {
  if (categoryId === "todos") {
    return true;
  }
  return (
    dish.categories.some(
      (item) => item.slug === categoryId || item.id === categoryId
    ) || dish.category === categoryId
  );
};

watchEffect(() => {
  const unique = new Map<string, string>();
  for (const dish of dishes.value) {
    for (const category of dish.categories) {
      unique.set(category.slug, category.name);
    }
    if ((!dish.categories || dish.categories.length === 0) && dish.category) {
      unique.set(dish.category, formatCategoryLabel(dish.category));
    }
  }
  const sortedCategories = Array.from(unique.entries())
    .map(([slug, name]) => ({ id: slug, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
  categoriesState.value = [{ id: "todos", name: "Todos" }, ...sortedCategories];
});

const searchFilteredDishes = computed<Dish[]>(() => {
  const term = searchQuery.value.trim().toLowerCase();

  return dishes.value.filter((dish) => {
    const matchesSearch =
      term.length === 0 ||
      dish.name.toLowerCase().includes(term) ||
      (dish.description ?? "").toLowerCase().includes(term);
    return matchesSearch;
  });
});

const filteredDishes = computed<Dish[]>(() => {
  const category = activeCategory.value;
  return searchFilteredDishes.value.filter((dish) =>
    dishMatchesCategory(dish, category)
  );
});

const groupedDishes = computed<
  { slug: string; name: string; dishes: Dish[] }[]
>(() => {
  const groups = new Map<
    string,
    { slug: string; name: string; dishes: Dish[] }
  >();
  for (const dish of searchFilteredDishes.value) {
    const catSlug = dish.categories[0]?.slug || dish.category;
    const catName = dish.categories[0]?.name || formatCategoryLabel(catSlug);
    if (!groups.has(catSlug)) {
      groups.set(catSlug, { slug: catSlug, name: catName, dishes: [] });
    }
    groups.get(catSlug)!.dishes.push(dish);
  }
  return Array.from(groups.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
});

const suggestionDishes = computed<Dish[]>(() => {
  if (filteredDishes.value.length) {
    return [];
  }
  const category = activeCategory.value;
  if (category === "todos") {
    return dishes.value.slice(0, 4);
  }
  const categoryMatches = dishes.value.filter((dish) =>
    dishMatchesCategory(dish, category)
  );
  if (categoryMatches.length) {
    return categoryMatches.slice(0, 4);
  }
  return dishes.value.slice(0, 4);
});

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const formatImage = (image?: string | null) => {
  if (!image) {
    return placeholderImage;
  }
  return image.includes("?")
    ? `${image}&auto=format&fit=crop&w=1200&q=80`
    : `${image}?auto=format&fit=crop&w=1200&q=80`;
};

const primaryCategoryLabel = (dish: Dish) => {
  if (dish.categories.length) {
    return dish.categories[0].name;
  }
  return formatCategoryLabel(dish.category);
};

const isDishModalOpen = ref(false);
const activeDish = ref<Dish | null>(null);
const sideSelections = ref<Record<string, string[]>>({});
const modalWrapperRef = ref<HTMLElement | null>(null);
const editingCartItemId = ref<string | null>(null);
const editingCartItemQuantity = ref<number>(1);

const ensureDishHasSideCategories = async (dish: Dish) => {
  if (dish.sideCategories?.length) {
    return {
      ...dish,
      sideCategories: cloneSideCategories(dish.sideCategories),
    };
  }
  if (!sharedSideCategories.value.length) {
    await refreshSideCategories();
  }
  const fallbackCategories = sharedSideCategories.value.length
    ? cloneSideCategories(sharedSideCategories.value)
    : cloneSideCategories();
  return {
    ...dish,
    sideCategories: fallbackCategories,
  };
};

const initializeSideSelections = (dish: Dish) => {
  const initialSelections: Record<string, string[]> = {};
  const categories = Array.isArray(dish.sideCategories)
    ? dish.sideCategories
    : [];
  for (const category of categories) {
    const available = category.sides.filter((side) => side.isAvailable);
    if (category.isRequired && available.length) {
      initialSelections[category.id] = [available[0].id];
    } else {
      initialSelections[category.id] = [];
    }
  }
  sideSelections.value = initialSelections;
};

const applySelectionsFromRecord = (
  dish: Dish,
  selections: Record<string, string[]>
) => {
  const resolvedSelections: Record<string, string[]> = {};
  const categories = Array.isArray(dish.sideCategories)
    ? dish.sideCategories
    : [];
  for (const category of categories) {
    const requested = Array.isArray(selections[category.id])
      ? selections[category.id]
      : [];
    const availableIds = new Set(category.sides.map((side) => side.id));
    const filtered = requested.filter((id) => availableIds.has(id));
    if (!filtered.length && category.isRequired) {
      const fallback = category.sides.find((side) => side.isAvailable);
      resolvedSelections[category.id] = fallback ? [fallback.id] : [];
    } else {
      resolvedSelections[category.id] = filtered;
    }
  }
  sideSelections.value = resolvedSelections;
};

const handleDishClick = (dish: Dish) => {
  // Check if it's a product (no side categories)
  if ((dish as any).isProduct || dish.sideCategories.length === 0) {
    // Add product directly to cart without modal
    const payload = {
      dish: {
        id: dish.id,
        name: dish.name,
        price: dish.price,
        image: dish.image,
        sideCategories: [],
      },
      selections: {},
      quantity: 1,
    };
    cartStore.addItem(payload);
  } else {
    // Open modal for dishes with side categories
    openDishModal(dish);
  }
};

const openDishModal = async (
  dish: Dish,
  options?: {
    selections?: Record<string, string[]>;
    cartItemId?: string | null;
    quantity?: number;
  }
) => {
  const resolvedDish = await ensureDishHasSideCategories(dish);
  activeDish.value = resolvedDish;
  if (options?.selections) {
    applySelectionsFromRecord(resolvedDish, options.selections);
  } else {
    initializeSideSelections(resolvedDish);
  }
  editingCartItemId.value = options?.cartItemId ?? null;
  editingCartItemQuantity.value = options?.quantity ?? 1;
  isDishModalOpen.value = true;
};

const closeDishModal = () => {
  isDishModalOpen.value = false;
  activeDish.value = null;
  sideSelections.value = {};
  editingCartItemId.value = null;
  editingCartItemQuantity.value = 1;
};

const activeDishCategories = computed(
  () => activeDish.value?.sideCategories ?? []
);

const getCategorySelection = (categoryId: string) =>
  sideSelections.value[categoryId] ?? [];
const selectionCount = (categoryId: string) =>
  getCategorySelection(categoryId).length;
const isOptionSelected = (category: SideCategory, option: SideOption) =>
  getCategorySelection(category.id).includes(option.id);
const isOptionDisabled = (category: SideCategory, option: SideOption) => {
  if (!option.isAvailable) {
    return true;
  }
  if (isOptionSelected(category, option)) {
    return false;
  }
  if (!category.maxSelections || category.maxSelections === 1) {
    return false;
  }
  return selectionCount(category.id) >= category.maxSelections;
};

const toggleSideSelection = (category: SideCategory, option: SideOption) => {
  if (!option.isAvailable) {
    return;
  }
  const isSelected = isOptionSelected(category, option);
  if (category.maxSelections === 1) {
    if (isSelected) {
      if (!category.isRequired) {
        sideSelections.value = {
          ...sideSelections.value,
          [category.id]: [],
        };
      }
    } else {
      sideSelections.value = {
        ...sideSelections.value,
        [category.id]: [option.id],
      };
    }
    return;
  }
  const current = getCategorySelection(category.id);
  if (isSelected) {
    sideSelections.value = {
      ...sideSelections.value,
      [category.id]: current.filter((id) => id !== option.id),
    };
    return;
  }
  if (category.maxSelections && current.length >= category.maxSelections) {
    return;
  }
  sideSelections.value = {
    ...sideSelections.value,
    [category.id]: [...current, option.id],
  };
};

const formatSideIncrement = (value?: number) => {
  if (!value) {
    return "";
  }
  return `+ ${currencyFormatter.format(value)}`;
};

const selectedSidesTotal = computed(() => {
  if (!activeDish.value) {
    return 0;
  }
  let total = 0;
  for (const category of activeDishCategories.value) {
    const selected = getCategorySelection(category.id);
    for (const id of selected) {
      const matched = category.sides.find((side) => side.id === id);
      if (matched) {
        total += matched.priceIncrement ?? 0;
      }
    }
  }
  return total;
});

const dishTotalPrice = computed(() => {
  const base = activeDish.value?.price ?? 0;
  return base + selectedSidesTotal.value;
});

const canConfirmSelection = computed(() => {
  if (!activeDish.value) {
    return false;
  }
  return activeDishCategories.value.every((category) => {
    if (!category.isRequired) {
      return true;
    }
    return selectionCount(category.id) > 0;
  });
});

const addDishToCart = () => {
  if (!canConfirmSelection.value || !activeDish.value) {
    return;
  }

  const dish = activeDish.value;
  const dishPayload = {
    id: dish.id,
    name: dish.name,
    price: dish.price,
    image: dish.image,
    sideCategories: dish.sideCategories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description ?? null,
      isRequired: category.isRequired,
      maxSelections: category.maxSelections ?? null,
      sides: category.sides.map((side) => ({
        id: side.id,
        name: side.name,
        description: side.description ?? null,
        priceIncrement: side.priceIncrement,
        image: side.image ?? null,
        isAvailable: side.isAvailable,
      })),
    })),
  };

  const selectionPayload = Object.entries(sideSelections.value).reduce<
    Record<string, string[]>
  >((acc, [categoryId, optionIds]) => {
    acc[categoryId] = [...optionIds];
    return acc;
  }, {});

  const payload = {
    dish: dishPayload,
    selections: selectionPayload,
    quantity: editingCartItemId.value ? editingCartItemQuantity.value : 1,
  };

  if (editingCartItemId.value) {
    cartStore.updateItem(editingCartItemId.value, payload);
  } else {
    cartStore.addItem(payload);
  }

  closeDishModal();
};

const selectionRecordFromCartItem = (item: CartItem) =>
  item.selections.reduce<Record<string, string[]>>((acc, selection) => {
    acc[selection.categoryId] = selection.options.map((option) => option.id);
    return acc;
  }, {});

watch(isDishModalOpen, (value) => {
  if (value) {
    nextTick(() => {
      modalWrapperRef.value?.focus();
    });
  }
});

watch(cartEditRequest, async (itemId) => {
  if (!itemId) {
    return;
  }
  const target = cartStore.items.find((item) => item.id === itemId);
  cartEditRequest.value = null;
  if (!target) {
    return;
  }
  const dishRecord = dishes.value.find((dish) => dish.id === target.dishId) ?? {
    id: target.dishId,
    name: target.name,
    description: null,
    price: target.basePrice,
    category: "todos",
    image: target.image ?? null,
    sideCategories: [],
    categories: buildDishCategories(["todos"]),
  };
  const selectionRecord = selectionRecordFromCartItem(target);
  await openDishModal(dishRecord, {
    selections: selectionRecord,
    cartItemId: target.id,
    quantity: target.quantity,
  });
});
</script>
