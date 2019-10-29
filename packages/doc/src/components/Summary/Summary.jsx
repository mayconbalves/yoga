import React, { useEffect, useState, useRef, Fragment } from 'react';
import { string } from 'prop-types';
import styled from 'styled-components';
import { Link } from 'gatsby';
import HeadingsQuery from './HeadingsQuery';

const Wrapper = styled.div`
  grid-area: Summary;
  position: relative;
  margin-left: 20px;
  margin-right: 20px;

  ${({ fixed }) =>
    fixed &&
    `
    position: fixed;
    right: 7px;
    top: 16px;
  `}
`;

const AnchorList = styled.ul`
  border-left: 1px solid #f6f6f6;
`;

const AnchorItem = styled.li`
  font-size: 12px;
  margin-bottom: 4px;

  a {
    color: inherit;
    display: block;
    overflow: hidden;
    padding-left: 16px;
    text-decoration: none;
    text-overflow: ellipsis;
    width: 100%;
    white-space: nowrap;
    transition: all 0.2s;

    &:hover {
      color: #f46152;
    }
  }
`;

const getLinks = ({ url, title }) => (
  <AnchorItem key={url}>
    <Link
      to={typeof window !== 'undefined' ? window.location.pathname + url : url}
    >
      {title}
    </Link>
  </AnchorItem>
);

getLinks.propTypes = {
  url: string.isRequired,
  title: string.isRequired,
};

const getHeadings = (edges = []) => {
  const pathname = typeof window !== 'undefined' && window.location.pathname;
  const paths = edges.filter(
    ({ node }) => node.fields && node.fields.slug === pathname,
  );

  const [
    {
      node: { tableOfContents = {} },
    },
  ] = paths.length ? paths : [{ node: {} }];

  if (!Object.keys(tableOfContents).length) {
    return [];
  }

  return tableOfContents.items;
};

const getSummary = edges => {
  const headings = getHeadings(edges);

  return (
    <AnchorList>
      {headings.map(heading => (
        <Fragment key={heading.url}>
          {getLinks(heading)}
          {headings.length === 1 &&
            heading.items &&
            heading.items.map(subHeading => getLinks(subHeading))}
        </Fragment>
      ))}
    </AnchorList>
  );
};

const Summary = () => {
  const ssr = typeof window !== 'undefined';
  const {
    allMdx: { edges },
  } = HeadingsQuery();
  const [fixed, setFixed] = useState(false);
  const wrapperRef = useRef(null);
  const handleScroll = () => ssr && setFixed(window.scrollY > 88);

  useEffect(() => {
    ssr && window.addEventListener('scroll', handleScroll);

    return () => ssr && window.removeEventListener('scroll', handleScroll);
  });

  return (
    <Wrapper fixed={fixed} ref={wrapperRef}>
      {getSummary(edges)}
    </Wrapper>
  );
};

export default Summary;