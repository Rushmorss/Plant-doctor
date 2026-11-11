import React from 'react';
import { howItWorks } from '../../data/landingContent';

export function HowItWorksSection() {
  return (
    <section id="cach-hoat-dong" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 md:px-8 lg:py-24">
      <h2 className="max-w-xl text-3xl font-bold tracking-tight text-ink md:text-4xl">
        Ba bước, không cần kiến thức công nghệ
      </h2>
      <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
        {howItWorks.map((step, index) =>
        <li key={step.title} className="relative">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-white">
                {index + 1}
              </span>
              {index < howItWorks.length - 1 &&
            <span className="hidden h-px flex-1 bg-secondary/60 md:block" aria-hidden="true" />
            }
            </div>
            <h3 className="mt-5 text-lg font-semibold text-ink">{step.title}</h3>
            <p className="mt-2 max-w-xs leading-relaxed text-ink/70">{step.description}</p>
          </li>
        )}
      </ol>
    </section>);

}