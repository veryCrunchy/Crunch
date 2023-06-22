import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>veryCrunchyDev</title>
        <meta name="description" content="veryCrunchyDev" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4">
          <div className="max-w-1xl select-none  truncate bg-white/50 bg-clip-text pb-5 text-5xl font-extrabold tracking-tight text-transparent sm:text-[5rem] md:max-w-[38rem] lg:max-w-3xl ">
            {(sessionData && (
              <h1 className="text-[13vw] xs:text-[10vw] sm:text-[5rem]">
                <span className="text-[10vw] xs:text-[7vw] sm:text-[3rem]">
                  Hello,
                </span>
                <br></br>
                {sessionData.user?.name}
              </h1>
            )) || (
              <h1 className="text-[13vw] xs:text-[11vw] sm:text-[5rem]">
                veryCrunchyDev
              </h1>
            )}
            <div className="mt-5 flex justify-between">
              <p className="bg-none text-[7vw] text-red-700 opacity-20 sm:text-4xl">
                this site is a w.i.p.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white"></p>
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-[white] no-underline transition hover:bg-white/20"
        onClick={
          sessionData ? () => void signOut() : () => void signIn("discord")
        }
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
