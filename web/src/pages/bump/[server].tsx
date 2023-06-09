import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import UserGreeting from "~/components/UserGreeting";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
const Home: NextPage = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();

  const server = router.query.server;
  const m = router.query.m || new Date().getMonth() + 1;
  const { data } = api.bumps.getAll.useQuery({
    server: String(server),
    month: Number(m),
  });
  const serverData = api.discord.getServerInfo.useQuery({
    server: String(server),
  }).data;
  return (
    <>
      <Head>
        <title>Bump Leaderboard</title>
        <meta name="description" content="Disboard bump leaderboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4">
          <UserGreeting screen={true} name={serverData?.name} />
          <div className="mb-2 h-auto w-full rounded-xl bg-gray-100/60 sm:py-5 md:w-5/6 md:max-w-3xl">
            <h1 className="mb-2 w-full select-none pt-4 text-center text-[10vw] font-bold leading-tight text-[#f59c89]/80 xs:text-5xl sm:pt-0 sm:text-6xl">
              {sessionData ? serverData?.name : "Leaderboard"}
            </h1>

            <div className="mx-auto my-2 max-w-md overflow-hidden rounded text-xs">
              {data?.map((bump, index) => {
                return <UserBump key={bump.id} index={index} bump={bump} />;
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

interface Options {
  index: number;
  bump: {
    id: string;
    uid: string;
    bumps: number;
  };
}

const UserBump: React.FC<Options> = (props: Options) => {
  const { index, bump } = props;
  const [isLoaded, setIsLoaded] = useState(false);

  const { data: u } = api.discord.getUserInfo.useQuery({
    user: bump.uid,
  });

  // const u = user?.find((u) => u.id == bump.uid);
  let src = "https://cdn.discordapp.com/embed/avatars/0.png";
  if (u) src = `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png`;

  let style =
    "relative mt-2 flex mx-2 items-center rounded-lg bg-white px-2 py-2 text-gray-900/90";
  if (index == 0)
    style += " bg-gradient-to-br from-yellow-400/60 to-orange-400/50";
  if (index == 1)
    style += " bg-gradient-to-br from-indigo-300/60 to-indigo-200/60";
  if (index == 2)
    style += " bg-gradient-to-br from-[#ffedde]/90 to-[#f8e0d1]/90";
  let display_name = u?.display_name;
  if (!u?.display_name) display_name = u?.username;
  let username;
  if (u?.username) username = `@${u?.username}`;
  if (u?.discriminator && u?.discriminator !== "0")
    username = `#${u?.discriminator}`;

  return (
    <div className={style}>
      <div className="flex">
        <div className="absolute h-10 w-10">
          <p className="text-md -translate-x- absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pr-1 text-lg font-bold">
            {index + 1}
            <span className="text-sm font-semibold">{ordinal(index + 1)}</span>
          </p>
        </div>
        {!isLoaded && (
          <div className="absolute ml-10 mr-3 h-10 w-10 animate-pulse select-none rounded-full bg-gray-400/50" />
        )}
        <Image
          onLoad={() => setIsLoaded(true)}
          className="ml-10 mr-3 h-10 w-10 select-none rounded-full"
          alt="user-icon"
          src={src}
          width={100}
          height={100}
        ></Image>
        <div className="flex w-[10rem]">
          {u ? (
            <p className="relative w-full whitespace-nowrap text-base font-extrabold">
              {display_name}
              <span className="absolute left-0 text-sm font-semibold text-gray-600/60">
                <br />
                {username}
              </span>
            </p>
          ) : (
            <div className="relative mt-1 h-4 w-[35vw] animate-pulse rounded-md bg-gray-400/50 xs:w-60">
              <br />
              <div className="mt-2 h-3 w-14 animate-pulse rounded-md bg-gray-400/50"></div>
            </div>
          )}
        </div>
      </div>
      <div className="absolute right-2 flex items-center text-2xl font-bold sm:right-5 ">
        <p className="w-8 px-1 text-center">{bump.bumps}</p>
      </div>
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
