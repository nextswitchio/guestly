export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: "Music" | "Tech" | "Art" | "Food";
  city: "Lagos" | "Abuja" | "Accra" | "Nairobi";
  image: string;
};

export const events: Event[] = [
  {
    id: "evt-1",
    title: "Tech Summit 2026",
    description: "A gathering of innovators and startups.",
    date: "2026-03-12",
    category: "Tech",
    city: "Lagos",
    image: "/globe.svg",
  },
  {
    id: "evt-2",
    title: "Music Fiesta",
    description: "Live performances by top artists.",
    date: "2026-04-05",
    category: "Music",
    city: "Abuja",
    image: "/vercel.svg",
  },
  {
    id: "evt-3",
    title: "Art Expo",
    description: "Showcasing contemporary African art.",
    date: "2026-05-20",
    category: "Art",
    city: "Accra",
    image: "/next.svg",
  },
  {
    id: "evt-4",
    title: "Street Food Carnival",
    description: "Taste cuisines from across the region.",
    date: "2026-06-10",
    category: "Food",
    city: "Nairobi",
    image: "/window.svg",
  },
  {
    id: "evt-5",
    title: "DevConf",
    description: "Talks and workshops for developers.",
    date: "2026-03-25",
    category: "Tech",
    city: "Abuja",
    image: "/file.svg",
  },
  {
    id: "evt-6",
    title: "Jazz Night",
    description: "An evening of soulful jazz.",
    date: "2026-03-18",
    category: "Music",
    city: "Lagos",
    image: "/vercel.svg",
  },
];

export function filterEvents(params: {
  q?: string;
  category?: Event["category"];
  city?: Event["city"];
  page?: number;
  pageSize?: number;
}) {
  const q = params.q?.toLowerCase() || "";
  const category = params.category?.toLowerCase();
  const city = params.city?.toLowerCase();
  let list = events.filter((e) => {
    const matchQ = q
      ? e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
      : true;
    const matchCat = category ? e.category.toLowerCase() === category : true;
    const matchCity = city ? e.city.toLowerCase() === city : true;
    return matchQ && matchCat && matchCity;
  });
  const page = params.page && params.page > 0 ? params.page : 1;
  const pageSize = params.pageSize && params.pageSize > 0 ? params.pageSize : 6;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const total = list.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  list = list.slice(start, end);
  return { data: list, page, pageCount, total };
}

export function getEventById(id: string) {
  return events.find((e) => e.id === id) || null;
}

function newId() {
  return `evt-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
}

export function addEvent(input: Omit<Event, "id">): Event {
  const e: Event = { id: newId(), ...input };
  events.push(e);
  return e;
}
