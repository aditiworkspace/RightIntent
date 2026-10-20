import { ArrowRight, ArrowUpRight } from "lucide-react";
import styles from "./intelligent-trader-showcase.module.css";

const editions = [
  {
    days: "07",
    title: "7-Day Trading Journal",
    label: "THE STARTER EDITION",
    description: "A simple first week of recording your trades, thoughts, and lessons.",
    className: styles.sevenDay,
    note: "Start with one week",
  },
  {
    days: "21",
    title: "21-Day Trading Journal",
    label: "THE ROUTINE EDITION",
    description: "Build a repeatable pre-market, trade review, and reflection routine.",
    className: styles.twentyOneDay,
    note: "Make it a habit",
  },
  {
    days: "100",
    title: "100-Day Trading Journal",
    label: "THE SIGNATURE EDITION",
    description: "A long-form journal to track consistency and learn from every setup.",
    className: styles.hundredDay,
    note: "The complete journey",
  },
];

export function IntelligentTraderShowcase() {
  return (
    <section className={`${styles.section} scroll-reveal`} id="intelligent-trader" aria-labelledby="intelligent-trader-title">
      <div className={styles.inner}>
        <div className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>Right Intent × Intelligent Trader</p>
            <h2 id="intelligent-trader-title" className="[margin:0] [font:400_clamp(28px,_3.2vw,_44px)/1.06_var(--serif)] [letter-spacing:-.045em]">Trade with a plan.<br /><em className="[color:var(--terra)] [font-style:italic]">Learn from every move.</em></h2>
            <p className={styles.intro}>A trading journal collection made with Intelligent Trader, designed to help you slow down, review your decisions, and grow with every session.</p>
          </div>
          <div className={styles.collabMark}>
            <span>IN COLLABORATION WITH</span>
            <strong>Intelligent<br />Trader</strong>
            <ArrowUpRight size={20} />
          </div>
        </div>

        <div className={styles.productGrid}>
          {editions.map((edition) => (
            <article className={styles.product} key={edition.days}>
              <div className={`${styles.art} ${edition.className}`} aria-label={`${edition.days}-day trading journal cover`}>
                <div className={styles.book}>
                  <span className={styles.bookCollab}>RIGHT INTENT <i>×</i> INTELLIGENT TRADER</span>
                  <span className={styles.bookDays}>{edition.days}</span>
                  <strong>DAY<br />TRADING<br />JOURNAL</strong>
                  <span className={styles.bookRule} />
                  <span className={styles.bookNote}>{edition.note}</span>
                </div>
                <span className={styles.editionLabel}>{edition.label}</span>
              </div>
              <div className={styles.productInfo}>
                <div>
                  <p>{edition.label}</p>
                  <h3>{edition.title}</h3>
                  <span>{edition.description}</span>
                </div>
                <div className={styles.launch}>
                  <span>Launching soon</span>
                  <button type="button" disabled aria-label={`${edition.title} launching soon`}>Coming soon <ArrowRight size={14} /></button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className={styles.footnote}>Three editions. One better trading habit. <span>Prices and launch details coming soon.</span></p>
      </div>
    </section>
  );
}
