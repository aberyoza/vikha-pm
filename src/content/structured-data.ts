import { modules, type CourseModule, type Lesson } from "./course";
import { SITE_NAME, SITE_URL } from "./site";

// Schema.org data for search engines (JSON-LD). Google reads Course for the
// course itself and BreadcrumbList for each lesson's place in it.

const COURSE_NAME = "Віха — курс з управління проєктами";
const COURSE_DESCRIPTION =
  "Безкоштовний курс з управління проєктами українською мовою на основі PMBOK 7 і 8: 14 модулів з інтерактивними схемами і практичними завданнями.";

const provider = { "@type": "Organization", name: SITE_NAME, url: SITE_URL };
const lessonUrl = (m: CourseModule, l: Lesson) => `${SITE_URL}/modules/${m.slug}/${l.slug}`;

export function courseJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${SITE_URL}/#course`,
    name: COURSE_NAME,
    description: COURSE_DESCRIPTION,
    url: SITE_URL,
    inLanguage: "uk",
    isAccessibleForFree: true,
    educationalLevel: "Beginner",
    teaches: "Управління проєктами за PMBOK 7 і 8",
    provider,
    offers: { "@type": "Offer", price: 0, priceCurrency: "UAH", category: "Free" },
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "Online", inLanguage: "uk" },
    syllabusSections: modules.map((m) => ({
      "@type": "Syllabus",
      name: `Модуль ${m.number}. ${m.title}`,
      description: m.description,
    })),
  };
}

export function lessonJsonLd(m: CourseModule, l: Lesson) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "LearningResource",
      name: l.title,
      description: l.description,
      url: lessonUrl(m, l),
      inLanguage: "uk",
      isAccessibleForFree: true,
      learningResourceType: "Lesson",
      isPartOf: { "@type": "Course", "@id": `${SITE_URL}/#course`, name: COURSE_NAME, provider },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
        // A module has no page of its own, so its crumb points to its first lesson.
        { "@type": "ListItem", position: 2, name: `Модуль ${m.number}. ${m.title}`, item: lessonUrl(m, m.lessons[0]) },
        { "@type": "ListItem", position: 3, name: l.title, item: lessonUrl(m, l) },
      ],
    },
  ];
}

// Safe inline script body: "<" is escaped so the JSON can't close the tag.
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
