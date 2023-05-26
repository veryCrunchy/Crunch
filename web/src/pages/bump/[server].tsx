import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();

  const server = router.query.server;
  const { data } = api.bumps.getAll.useQuery({
    server: String(server),
  });

  const users: string[] = [];
  data?.forEach((i) => {
    users.push(i.uid);
  });

  const { data: user } = api.discord.getBasicUsersInfo.useQuery({
    users: users,
  });

  return (
    <>
      <Head>
        <title>Bump Leaderboard</title>
        <meta name="description" content="Disboard bump leaderboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen  flex-col items-center justify-center">
        <div className="container  flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="select-none bg-white/50 bg-clip-text pb-5 text-5xl font-extrabold tracking-tight text-transparent sm:text-[5rem]">
            {(sessionData && (
              <span>
                <span className="text-2xl sm:text-[3rem] ">Hello,</span>
                <br></br>
                {sessionData.user?.name}
              </span>
            )) || (
              <span className="text-[12vw] sm:text-[5rem]">veryCrunchyDev</span>
            )}
            <div className="mt-5 flex justify-between">
              <p className="bg-none text-[7vw] text-red-700 opacity-20 sm:text-4xl">
                this site is a w.i.p.
              </p>
              <div className="flex text-sm sm:text-lg">
                <SignIn />
              </div>
            </div>
          </h1>
          <div className="h-auto w-full rounded-xl bg-gray-100/80 py-5 md:w-5/6 md:max-w-3xl">
            <h1 className="mb-2 w-full select-none pb-4 text-center text-4xl font-bold leading-tight text-gray-800 sm:text-5xl">
              Leaderboard
            </h1>

            <div className="mx-auto my-2 max-w-md overflow-hidden rounded text-xs">
              {data?.map((bump, index) => {
                const u = user?.find((u) => u.id == bump.uid);
                let src = `https://cdn.discordapp.com/avatars/${u?.id || "0"}/${
                  u?.avatar || "default-avatar"
                }.png`;
                if (src.includes("default-avatar"))
                  src = "https://cdn.discordapp.com/embed/avatars/0.png";

                let style =
                  "relative mb-2 flex mx-2 items-center rounded-lg bg-white px-2 py-2 text-gray-900/90";
                if (index == 0)
                  style +=
                    " bg-gradient-to-br from-yellow-400/60 to-orange-400/50";
                if (index == 1)
                  style +=
                    " bg-gradient-to-br from-indigo-300/60 to-indigo-200/60";
                if (index == 2)
                  style +=
                    " bg-gradient-to-br from-[#645441]/40 to-[#30291f]/30";

                return (
                  <div key={bump.id} className={style}>
                    <div className="flex w-5/12">
                      <div className="absolute h-10 w-10">
                        <p className="text-md -translate-x- absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pr-1 text-lg font-bold">
                          {index + 1}
                          <span className="text-sm font-semibold">
                            {ordinal(index + 1)}
                          </span>
                        </p>
                      </div>
                      <Image
                        className="ml-10 mr-4 h-10 w-10 select-none rounded-full"
                        alt="user-icon"
                        src={src}
                        width={100}
                        height={100}
                      ></Image>
                      <div className="flex flex-col">
                        <p className="relative text-base font-extrabold">
                          {u?.username || ""}
                          <span className="absolute left-0 text-sm font-semibold text-gray-600/60">
                            <br />#{u?.discriminator || ""}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className=" absolute right-5 flex items-center text-lg font-bold sm:text-2xl">
                      <p className="w-8 px-1 text-center">{bump.bumps}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const SignIn: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        className="rounded-full bg-white/10 px-[3vw]  py-[2vw] font-semibold text-white no-underline transition hover:bg-white/20 sm:px-6 sm:py-2"
        onClick={
          sessionData ? () => void signOut() : () => void signIn("discord")
        }
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

function ordinal(i: number) {
  const j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return "st";
  }
  if (j == 2 && k != 12) {
    return "nd";
  }
  if (j == 3 && k != 13) {
    return "rd";
  }
  return "th";
}
