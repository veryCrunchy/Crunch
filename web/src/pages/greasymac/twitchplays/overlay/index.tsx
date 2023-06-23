import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

const Home: NextPage = () => {
  interface Data {
    name: string;
    inputs: string[];
  }

  const { data, refetch } = api.twitchplays.get.useQuery<Data[]>();

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch().catch((error) => {
        console.error("Error fetching data:", error);
      });
    }, 10000); // Fetch every 10 seconds (10000 milliseconds)

    return () => {
      clearInterval(intervalId);
    };
  }, [refetch]);

  if (!data)
    return (
      <>
        {" "}
        <Head>
          <title>TwitchPlays</title>
          <meta
            property="og:title"
            content="Not streaming TwitchPlays at the moment."
          />
          <meta name="theme-color" content="#794ec4" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link rel="icon" href="/favicon.greasymac.ico" />
        </Head>
      </>
    );
  return (
    <>
      <Head>
        <title>TwitchPlays</title>
        <meta property="og:title" content="TwitchPlays" />
        <meta
          property="og:description"
          content="View the inputs of the current Twitch Plays game."
        />
        <meta name="theme-color" content="#794ec4" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.greasymac.ico" />
      </Head>
      <style jsx global>{`
        #_app {
          background: transparent !important;
        }

        .twitchplays_card_overlay {
          border-radius: 16px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          -webkit-backdrop-filter: blur(17.1px);
          border: 1px solid rgba(122, 61, 212, 0.33);
        }

        html {
          font-family: ${inter.style.fontFamily};
        }

        #inputs ul {
          list-style-type: disc;
          padding-left: 20px;
        }

        #inputs strong {
          font-size: 1.4rem;
          font-weight: bold;
          color: #cc7eff;
          text-transform: capitalize;
        }

        #inputs code {
          background: rgba(122, 70, 199, 0.08);
          border: 1px solid rgba(193, 157, 251, 0.3);
          border-radius: 4px;
          color: #c19dfb;
          font-size: 1.1rem;
          font-weight: bold;
          list-style: none;
          display: inline-block;
          word-break: break-all;
        }
      `}</style>
      <main className="flex min-h-screen justify-center">
        <div className="container flex max-w-fit flex-col items-center justify-center">
          <div className="twitchplays_card_overlay h-auto w-screen rounded-xl bg-[#0d1117]/90 py-2">
            <div className="mx-auto flex flex-col " id="inputs">
              {(data as Data[])?.map((input: Data) => {
                return (
                  <>
                    <ul
                      key={input.name}
                      className="my-[0.12rem] flex flex-row flex-wrap gap-1 whitespace-nowrap uppercase leading-none"
                    >
                      <strong>{input.name}:</strong>
                      <br className="sm:hidden" />{" "}
                      {input.inputs.map((input) => {
                        return (
                          <>
                            <code className="px-1 py-1">{input}</code>
                          </>
                        );
                      })}
                    </ul>
                  </>
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
