import { getDictionary } from "../../get-dictionary";
import { Locale } from "../../i18n-config";
import HomeContent from "../../components/HomeContent";

export default async function IndexPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);

  return <HomeContent dictionary={dictionary} lang={locale} />;
}
