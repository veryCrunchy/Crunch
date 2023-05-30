import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Suspense } from "react";
import UserGreeting from "~/components/UserGreeting";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const router = useRouter();

  const server = router.query.server;
  const { data } = api.bumps.getAll.useQuery({
    server: String(server),
  });

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
          <UserGreeting screen={true} />
          <div className="mb-2 h-auto w-full rounded-xl bg-gray-100/60 sm:py-5 md:w-5/6 md:max-w-3xl">
            <h1 className="mb-2 w-full select-none pt-4 text-center text-[10vw] font-bold leading-tight text-[#f59c89]/80 xs:text-5xl sm:pt-0 sm:text-6xl">
              Leaderboard
            </h1>

            <div className="mx-auto my-2 max-w-md overflow-hidden rounded text-xs">
              {data?.map((bump, index) => {
                return (
                  <Suspense key={bump.id}>
                    <UserBump index={index} bump={bump} />
                  </Suspense>
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
    style += " bg-gradient-to-br from-[#ffdcc0]/90 to-[#decbbd]/90";

  return (
    <div className={style}>
      <div className="flex w-5/12">
        <div className="absolute h-10 w-10">
          <p className="text-md -translate-x- absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pr-1 text-lg font-bold">
            {index + 1}
            <span className="text-sm font-semibold">{ordinal(index + 1)}</span>
          </p>
        </div>
        <Image
          className="ml-10 mr-4 h-10 w-10 select-none rounded-full"
          alt="user-icon"
          src={src}
          width={100}
          height={100}
        ></Image>
        <div className="flex w-full">
          {u ? (
            <p className="relative w-full whitespace-nowrap text-base font-extrabold">
              {u?.username}
              <span className="absolute left-0 text-sm font-semibold text-gray-600/60">
                <br />#{u?.discriminator || ""}
              </span>
            </p>
          ) : (
            <div className="relative mt-1 h-4 w-full animate-pulse rounded-md bg-gray-300">
              <br />
              <div className="mt-2 h-2 w-2/3 animate-pulse rounded-md bg-gray-300"></div>
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
