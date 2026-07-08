import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ButtonLink';
import { Panel } from '@/components/Panel';

export const metadata: Metadata = {
  title: 'QOOBIX IDAAS Services',
  description: 'Market-intelligence packages delivered through QOOBIX IDAAS.'
};

const services = [
  {
    title: 'Market Reality Check',
    text: 'For businesses that need to understand whether a market, region or commercial idea deserves further attention.'
  },
  {
    title: 'Competitor Mapping',
    text: 'For businesses that need to understand who competes with them, by segment, geography, positioning and customer type.'
  },
  {
    title: 'Distributor Discovery',
    text: 'For manufacturers or suppliers looking for candidate distributors, resellers or channel partners for verification.'
  },
  {
    title: 'Partner Discovery',
    text: 'For companies looking for possible commercial partners, referral partners, technical partners or local market-entry allies.'
  },
  {
    title: 'Market Entry Intelligence Pack',
    text: 'For businesses preparing to enter a country, region or sector and needing analysis, discovery, prioritisation and action steps.'
  },
  {
    title: 'Location and Expansion Intelligence',
    text: 'For restaurants, hospitality businesses, retail businesses or service companies evaluating local competition, customer segments and expansion zones.'
  }
];

export default function ServicesPage() {
  return (
    <section className="qoobix-container py-12 md:py-18">
      <div className="max-w-3xl">
        <p className="qoobix-kicker">Services</p>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.045em] md:text-5xl">
          Intelligence packages for practical market decisions.
        </h1>
        <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">
          QOOBIX IDAAS is delivered as a managed service. The operator captures the analysed
          business and market question, prepares the intelligence process, reviews the outputs and
          delivers structured files the client can use.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Panel key={service.title}>
            <h2 className="text-xl font-semibold tracking-[-0.025em]">{service.title}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--qoobix-muted)]">{service.text}</p>
          </Panel>
        ))}
      </div>

      <div className="mt-10 rounded-[var(--qoobix-radius-large)] border border-[var(--qoobix-border)] bg-white/52 p-6 md:p-8">
        <h2 className="text-2xl font-semibold tracking-[-0.035em]">Specialist private environments</h2>
        <p className="mt-4 leading-8 text-[var(--qoobix-muted)]">
          A provisioned private QOOBIX environment may be considered for selected organisations or
          authorised operators, subject to qualification, configuration, training and controls. It is
          not the default public offer.
        </p>
        <div className="mt-6">
          <ButtonLink href="/contact">Request an intelligence review</ButtonLink>
        </div>
      </div>
    </section>
  );
}
