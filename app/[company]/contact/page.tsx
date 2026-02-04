import ContactPage from "../../contact/page";
import { getCompanyNames } from "@/lib/data-loader";

// Generate static paths for all companies
export function generateStaticParams() {
  const companies = getCompanyNames();
  return companies
    .filter((company) => company !== "default")
    .map((company) => ({
      company: company,
    }));
}

export default function Page() {
  return <ContactPage />;
}
