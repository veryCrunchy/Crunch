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
  console.log(user);
  console.log("test");

  return (
    <>
      <Head>
        <title>Bump Leaderboard</title>
        <meta name="description" content="Disboard bump leaderboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#f77627] to-[#fc3b51]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="bg-white/50 bg-clip-text pb-5 text-5xl font-extrabold tracking-tight text-transparent sm:text-[5rem]">
            {(sessionData && (
              <span>
                <span className="text-2xl sm:text-[3rem] ">Hello,</span>
                <br></br>
                {sessionData.user?.name}
              </span>
            )) || <span>veryCrunchyDev</span>}
            <p className="mt-5 bg-none text-4xl text-red-700 opacity-20">
              this site is a w.i.p.
            </p>
          </h1>
          <div className="clear-both mt-1 h-auto w-full border-b py-8">
            <div className="b-24 container mx-auto py-4 ">
              <h1 className="mb-2 w-full text-center text-5xl font-bold leading-tight text-gray-800">
                Leaderboard
              </h1>
              <div className="mb-4 w-full">
                <div className="mx-auto my-0 h-1 w-2/5 rounded-t py-0 opacity-25"></div>
              </div>
              <div className="mx-auto my-2 max-w-md overflow-hidden rounded  text-xs shadow-md">
                <div className="flex  justify-end px-2 py-2">
                  <div className="flex w-5/12 items-center justify-end">
                    <p className="w-8 px-2 text-center">bumps this month</p>
                  </div>
                  <div className="w-1/6 pl-14 text-right text-gray-400">
                    nr.
                  </div>
                </div>

                {data?.map((bump, index) => {
                  let src = `https://cdn.discordapp.com/avatars/${bump.uid}/${
                    user?.[index]?.avatar || "default-avatar"
                  }.png`;
                  if (src.includes("default-avatar"))
                    src = "https://cdn.discordapp.com/embed/avatars/0.png";
                  return (
                    <div
                      key={bump.id}
                      className="mb-2 flex items-center rounded-lg bg-white px-2 py-2"
                    >
                      <div className="flex w-5/12">
                        <Image
                          className="sm: mr-2 h-10 w-20 self-center rounded-full sm:h-20"
                          alt="user-icon"
                          src={src}
                          width={100}
                          height={100}
                        ></Image>
                        <div className="flex flex-col">
                          <p className="text-sm font-bold text-gray-900/90">
                            {user?.[index]?.username || ""}
                          </p>
                          <p className="hidden text-gray-600 sm:block">
                            # {user?.[index]?.discriminator || ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex w-5/12 items-center justify-end text-right text-lg font-bold sm:text-xl ">
                        <p className="w-8 px-1 text-center">{bump.bumps}</p>
                      </div>
                      <p className="text-md w-1/6 pl-14  font-semibold">
                        {index + 1}
                      </p>
                    </div>
                  );
                })}
              </div>
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

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

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