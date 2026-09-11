import { useState } from 'react';
import { config } from '../config';
import { tpl } from '../lib/tpl';
import CountdownBanner from '../components/CountdownBanner';
import IntroCrawl from '../components/IntroCrawl';
import type { HuntAction } from '../state/huntReducer';

type Props = { dispatch: React.Dispatch<HuntAction> };

/**
 * Cold open: a Star Wars-style crawl, then a "HAPPY BIRTHDAY" reveal, then
 * the usual birthday-hunt intro (countdown + CTA into the hunt). Merged in
 * from the old two-package plan's phase 2 (coco_bday) now that it's a single
 * hunt — see src/config.ts intro.crawl / greeting / heroLine / subtitle.
 */
export default function Intro({ dispatch }: Props) {
  const { intro } = config;
  const [crawlDone, setCrawlDone] = useState(false);

  if (!crawlDone) {
    return (
      <IntroCrawl
        episode={intro.crawl.episode}
        title={intro.crawl.title}
        paragraphs={intro.crawl.paragraphs}
        onDone={() => setCrawlDone(true)}
      />
    );
  }

  return (
    <section className="screen screen--intro">
      <div className="intro__top">
        <p className="eyebrow intro-reveal-greeting">{tpl(intro.greeting)}</p>
        <h1 className="sw-logo intro-reveal-hero">{intro.heroLine}</h1>
        <p className="intro-reveal-subtitle">{intro.subtitle}</p>
        <p className="intro__body">{intro.body}</p>
      </div>
      <CountdownBanner inline />
      <div className="intro__bottom">
        <button className="btn-primary" onClick={() => dispatch({ type: 'START_HUNT' })}>
          {intro.cta}
        </button>
        {intro.finePrint && <p className="fine-print">{intro.finePrint}</p>}
      </div>
    </section>
  );
}
