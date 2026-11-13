import { Suspense } from "react";
import PageConfetti from "./page-confetti";

const TABNEWS_URL = "https://www.tabnews.com.br";

const numberFormatter = new Intl.NumberFormat("pt-BR");

async function getTotalPosts(): Promise<number | null> {
  try {
    const response = await fetch(
      `${TABNEWS_URL}/api/v1/contents?strategy=new&page=1&per_page=1`,
      { next: { revalidate: 3600 } },
    );

    if (!response.ok) {
      return null;
    }

    const total = Number(response.headers.get("x-pagination-total-rows"));
    return Number.isFinite(total) ? total : null;
  } catch {
    return null;
  }
}

async function TotalPosts() {
  const totalPosts = await getTotalPosts();

  return (
    <p className="counter">
      {totalPosts === null
        ? "Não foi possível carregar o total de posts no momento."
        : `Total de posts no TabNews: ${numberFormatter.format(totalPosts)}`}
    </p>
  );
}

export default function Home() {
  return (
    <main className="container">
      <PageConfetti />
      <h1>Trabalho em andamento</h1>
      <p className="message">
        We are at this moment rebuild TabNews, a place on the internet for
        anyone interested in tech and wants to consume valuable content
      </p>
      <Suspense
        fallback={<p className="counter">Carregando total de posts...</p>}
      >
        <TotalPosts />
      </Suspense>
      <p className="official-link">
        Visite a página oficial:{" "}
        <a href={TABNEWS_URL} target="_blank" rel="noopener noreferrer">
          {TABNEWS_URL}
        </a>
      </p>
    </main>
  );
}
