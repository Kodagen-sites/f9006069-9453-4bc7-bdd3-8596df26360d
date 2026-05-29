import HeroScrollAssemble from "@/components/sections/HeroScrollAssemble";
import ValueProp from "@/components/sections/ValueProp";
import ServicesGrid from "@/components/sections/ServicesGrid";
import Stats from "@/components/sections/Stats";
import Process from "@/components/sections/Process";
import AboutPreview from "@/components/sections/AboutPreview";
import Manifesto from "@/components/sections/Manifesto";
import CtaSplitForm from "@/components/sections/CtaSplitForm";

export const metadata = {
  title: "Healthcare data infrastructure, secured at the source",
  description:
    "Medivault unifies EHR systems, audit trails, and AI insights into one HIPAA-compliant infrastructure for healthcare providers.",
};

export default function HomePage() {
  return (
    <>
      <HeroScrollAssemble />
      <ValueProp />
      <ServicesGrid />
      <Stats />
      <Process />
      <Manifesto />
      <AboutPreview />
      <CtaSplitForm />
    </>
  );
}
