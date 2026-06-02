import { NextRequest, NextResponse } from 'next/server';
import { notFound } from 'next/navigation';
import { isValidAdminPassword } from '@/lib/auth/admin';
import { env } from '@/lib/config';
import { updateClientCommercialSettings } from '@/lib/qoobix/db';

type CommercialRouteProps = {
  params: Promise<{
    adminPath: string;
    clientId: string;
  }>;
};

function asPositiveInteger(value: unknown, fallback: number) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(0, Math.floor(parsed));
}

function asDateString(value: unknown, fallback: string) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return fallback;
  }

  return value;
}

export async function POST(request: NextRequest, { params }: CommercialRouteProps) {
  const { adminPath, clientId } = await params;

  if (adminPath !== env.QOOBIX_ADMIN_PATH) {
    notFound();
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;

    if (!isValidAdminPassword(typeof body.adminPassword === 'string' ? body.adminPassword : '')) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Invalid admin password.'
        },
        { status: 401 }
      );
    }

    const qoobixPlan =
      body.qoobixPlan === 'analysis_discovery' ? 'analysis_discovery' : 'analysis';

    const today = new Date().toISOString().slice(0, 10);
    const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    await updateClientCommercialSettings({
      clientId,
      qoobixPlan,
      isInternalAccount: body.isInternalAccount === true,
      licenceStartsAt: asDateString(body.licenceStartsAt, today),
      licenceEndsAt: asDateString(body.licenceEndsAt, nextYear),
      maxAnalysisJobsPerYear: asPositiveInteger(body.maxAnalysisJobsPerYear, 10),
      maxDiscoveryJobsPerYear: asPositiveInteger(body.maxDiscoveryJobsPerYear, 0),
      maxTotalJobsPerYear: asPositiveInteger(body.maxTotalJobsPerYear, 10),
      maxCountriesPerDiscoveryJob: asPositiveInteger(body.maxCountriesPerDiscoveryJob, 1),
      maxCandidatesPerDiscoveryJob: asPositiveInteger(body.maxCandidatesPerDiscoveryJob, 120),
      extraAnalysisJobCredits: asPositiveInteger(body.extraAnalysisJobCredits, 0),
      extraDiscoveryJobCredits: asPositiveInteger(body.extraDiscoveryJobCredits, 0),
      extraCountryCredits: asPositiveInteger(body.extraCountryCredits, 0),
      extraCandidatePackCredits: asPositiveInteger(body.extraCandidatePackCredits, 0)
    });

    return NextResponse.json({
      ok: true
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Could not update commercial settings.';

    return NextResponse.json(
      {
        ok: false,
        error: message
      },
      { status: 500 }
    );
  }
}
