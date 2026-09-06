import { NextResponse } from 'next/server';
import { getBudgetTravelBuckets } from '@/lib/recommendation-engine';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const budget = Number(searchParams.get('budget')) || 10000;
  const fromCity = searchParams.get('from') || 'Pune';
  const people = Number(searchParams.get('people')) || 2;
  const days = Number(searchParams.get('days')) || 3;

  const buckets = getBudgetTravelBuckets(budget, fromCity, people, days);

  return NextResponse.json({
    success: true,
    query: { budget, fromCity, people, days },
    buckets
  });
}
