import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Hexagon from "../components/Icons/Hexagon";
import Voting from "../components/Icons/Voting";
import Minion from "../components/Icons/Minion";
import Modal from "../components/Modal";
import cloudinary from "../utils/cloudinary";
import getBase64ImageUrl from "../utils/generateBlurPlaceholder";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";

const Home: NextPage = ({ images }: { images: ImageProps[] }) => {
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  const isBrowser = () => typeof window !== "undefined"; //The approach recommended by Next.js

  function scrollToTop() {
    if (!isBrowser()) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  return (
    <>
      <Head>
        <title>💠Meu Malvado Favorito💠</title>
        <meta
          property="og:image"
          content="https://e0.pxfuel.com/wallpapers/614/1019/desktop-wallpaper-despicable-me-2-minions-x-post-from-i-black-minion.jpg"
        />
        <meta name="twitter:card" content="summary" />
        <meta property="twitter:title" content="💠Meu Malvado Favorito💠" />
        <meta
          property="twitter:description"
          content="Índices e resultados do último governo e atual administração."
        />
        <meta
          property="twitter:image"
          content="https://e0.pxfuel.com/wallpapers/614/1019/desktop-wallpaper-despicable-me-2-minions-x-post-from-i-black-minion.jpg"
        />
        <meta
          property="twitter:url"
          content="https://malvadofavorito.vercel.app/"
        />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        {photoId && (
          <Modal
            images={images}
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
          />
        )}
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
          <div className="after:content relative mb-5 flex h-[629px] flex-col items-center justify-end gap-4 overflow-hidden rounded-lg bg-white/10 px-6 pb-16 pt-64 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-0">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <span className="flex max-h-full max-w-full items-center justify-center">
                <Hexagon />
              </span>
              <span className="absolute left-0 right-0 bottom-0 h-[400px] bg-gradient-to-b from-black/0 via-black to-black"></span>
            </div>
            <Voting />
            <h1 className="mt-8 mb-4 text-base font-bold uppercase tracking-widest">
              RESULTADOS DE GOVERNOS
            </h1>
            <p className="max-w-[40ch] text-white/75 sm:max-w-[32ch]">
              Índices e resultados do último governo e atual administração.
            </p>
            <p className="max-w-[40ch] text-white/75 sm:max-w-[32ch]">
              Muitas informações não chegam ao público porque existe muito
              financiamento para acobertamento e propaganda.
            </p>
            <a
              className="pointer z-10 mt-6 rounded-lg border border-white bg-green-700 px-3 py-2 text-sm font-semibold text-yellow transition hover:bg-yellow-300 hover:text-green-900 md:mt-4"
              href="https://patria-amada-brasil.vercel.app/"
              target="_blank"
              rel="noreferrer"
            >
              Governo Pátria Amada Brasil (2018{"-"}2022)
            </a>
          </div>
          {images.map(({ id, public_id, format, blurDataUrl }) => (
            <Link
              key={id}
              href={`/?photoId=${id}`}
              as={`/p/${id}`}
              ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              shallow
              className="after:content group relative mb-15 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            >
              <Image
                alt="Next.js Conf photo"
                className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                style={{ transform: "translate3d(0, 0, 0)" }}
                placeholder="blur"
                blurDataURL={blurDataUrl}
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
              />
            </Link>
          ))}
        </div>
          <span onClick={scrollToTop} className="text-emerald-400 w-4 h-4 fixed bottom-2 right-1 p-5 zindex bg-slate-200 opacity-5">
            <FontAwesomeIcon icon={faArrowUp} size="1x" />
          </span>
      </main>

      <footer className="p-6 text-center text-white/80 sm:p-12 content-center">
        <div className="w-[128px] p-1 mx-auto text-center">
          <Link
            href="https://www.artesdosul.com/"
            target="_blank"
            title="Thank you to artesdosul"
            className="font-semibold hover:text-white content-center"
            rel="noreferrer"
          >
            <Minion />
          </Link>
        </div>
      </footer>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by("public_id", "desc")
    .max_results(400)
    .execute();
  let reducedResults: ImageProps[] = [];

  let i = 0;
  for (let result of results.resources) {
    reducedResults.push({
      id: i,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
    });
    i++;
  }

  const blurImagePromises = results.resources.map((image: ImageProps) => {
    return getBase64ImageUrl(image);
  });
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i];
  }

  return {
    props: {
      images: reducedResults,
    },
  };
}
