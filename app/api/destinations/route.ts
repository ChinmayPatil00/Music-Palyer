import { NextResponse } from 'next/server';
import { DESTINATIONS } from '@/data/destinations';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region');
  const query = searchParams.get('q')?.toLowerCase();
  const difficulty = searchParams.get('difficulty');
  const maxBudget = searchParams.get('maxBudget');
  const isInternational = searchParams.get('international');

  let results = [...DESTINATIONS];

  if (region) {
    results = results.filter((d) => d.region.toLowerCase() === region.toLowerCase());
  }

  if (isInternational !== null && isInternational !== undefined) {
    const intBool = isInternational === 'true';
    results = results.filter((d) => d.isInternational === intBool);
  }

  if (difficulty) {
    results = results.filter((d) => d.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  if (maxBudget) {
    const budgetNum = Number(maxBudget);
    if (!isNaN(budgetNum)) {
      results = results.filter((d) => d.startingPrice <= budgetNum);
    }
  }

  if (query) {
    results = results.filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        (d.state && d.state.toLowerCase().includes(query)) ||
        d.country.toLowerCase().includes(query) ||
        d.categories.some((c) => c.toLowerCase().includes(query)) ||
        d.popularActivities.some((a) => a.toLowerCase().includes(query))
    );
  }

  return NextResponse.json({
    total: results.length,
    destinations: results
  });
}
