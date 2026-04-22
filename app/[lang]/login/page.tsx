import { getDictionary } from "../../../get-dictionary";
import { Locale } from "../../../i18n-config";
import LoginContent from "../../../components/LoginContent";

export default async function LoginPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);

  return <LoginContent dictionary={dictionary} lang={locale} />;
}
