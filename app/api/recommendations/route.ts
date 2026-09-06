import { NextResponse } from 'next/server';
import { TripPlanRequest } from '@/types';
import { getRankedRecommendations } from '@/lib/recommendation-engine';

export async function POST(request: Request) {
  try {
    const body: TripPlanRequest = await request.json();
    const recommendations = getRankedRecommendations(body);
    return NextResponse.json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to generate recommendations' },
      { status: 400 }
    );
  }
}
