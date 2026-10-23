import type { Metadata } from "next";
import Link from "next/link";
import { ContactSection } from "@/components/ContactSection";
import { IconBack } from "@/components/CaseIcons";
import { ProjectsCatalog } from "@/components/ProjectsCatalog";
import { StarfieldTunnel } from "@/components/StarfieldTunnel";
import { finalCta } from "@/data/home";
import { projects } from "@/data/projects";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Проекты",
  description: "Портфолио реализованных проектов NC 1.",
};

export default function ProjectsPage() {
  return (
    <>
      <section className={styles.page}>
        <StarfieldTunnel />
        <div className={`container ${styles.content}`}>
          <header className={styles.header}>
            <Link href="/" className={styles.back}>
              <IconBack />
              на главную
            </Link>
            <p className={`sectionLabel ${styles.label}`}>[ портфолио ]</p>
            <h1 className={styles.title}>
              Все <span className="textAccent">проекты</span>
            </h1>
          </header>
          <ProjectsCatalog projects={projects} />
        </div>
      </section>
      <ContactSection
        titleLines={finalCta.projectsTitleLines}
        accentLineIndexes={finalCta.projectsAccentLineIndexes}
      />
    </>
  );
}
