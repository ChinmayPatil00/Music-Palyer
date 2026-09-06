import { NextResponse } from 'next/server';
import { DESTINATIONS } from '@/data/destinations';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const destinationId = searchParams.get('id');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  const dest = DESTINATIONS.find((d) => d.id === destinationId || d.slug === destinationId);

  if (dest) {
    const isRainRisky = dest.weatherSummary.rainProbability > 40;
    const isWindRisky = dest.weatherSummary.windSpeedKmh > 35;

    let warning = null;
    if (isRainRisky) {
      warning = 'Elevated monsoon rainfall risk: River crossings, cliff faces, and high passes may be slippery or restricted.';
    } else if (isWindRisky) {
      warning = 'High velocity winds reported: Caution advised for high-ridge camping, paragliding, or drone operations.';
    }

    return NextResponse.json({
      success: true,
      destination: dest.name,
      weather: dest.weatherSummary,
      warning,
      suitabilityIndex: dest.weatherSummary.suitability,
      safetyIndex: dest.safetyIndex
    });
  }

  // Fallback generic weather
  return NextResponse.json({
    success: true,
    destination: 'Adventure Zone',
    weather: {
      currentTempC: 22,
      condition: 'Partly Cloudy & Mountain Breeze',
      rainProbability: 10,
      windSpeedKmh: 12,
      humidity: 50,
      suitability: 'Ideal'
    },
    warning: null,
    suitabilityIndex: 'Ideal',
    safetyIndex: 'High Safety'
  });
}
