import { type NextPage } from "next";
import Head from "next/head";
import UserGreeting from "~/components/UserGreeting";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>veryCrunchyDev</title>
        <meta name="description" content="veryCrunchyDev" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4">
          <UserGreeting />
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white"></p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
