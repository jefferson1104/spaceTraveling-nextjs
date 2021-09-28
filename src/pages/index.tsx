import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../services/prismic';

import styles from './home.module.scss';

import commonStyles from '../styles/common.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ posts }) {
  return (
    <>
      <Head>
        <title>Posts | SpaceTraveling</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link key={post.slug} href={`/post/${post.slug}`}>
              <a>
                <h1>{post.title}</h1>
                <p>{post.subtitle}</p>
                <div className={styles.postInfo}>
                  <time>
                    <FiCalendar /> {post.datePost}
                  </time>
                  <p>
                    <FiUser /> {post.author}
                  </p>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize: 3,
      orderings: '[document.last_publication_date desc]',
    }
  );

  const posts = postsResponse.results.map(post => {
    return {
      slug: post.uid,
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
      datePost: format(new Date(post.last_publication_date), 'dd MMM Y', {
        locale: ptBR,
      }),
    };
  });

  console.log('CONSOLANDO ====>', posts);

  /*
  const nextpost =
  (
    await client.query(Prismic.Predicates.at('document.type', 'post'), {
      pageSize: 1,
      after: `${post.id}`,
      orderings: '[my.post.date]',
    })
  ).results[0] || 'undefined';
  */

  return {
    props: {
      posts,
    },
  };
};
