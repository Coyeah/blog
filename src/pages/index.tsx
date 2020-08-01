import React from "react"
import { useStaticQuery, graphql } from 'gatsby';
import Basic from '../layouts/basic';
import { ExceptionDiv } from "./404";

const List: React.FC<Issues> = props => {
  const { nodes = [], edges, totalCount } = props;
  return (
    <>
      {nodes.map((node, key) => {

        return (
          <div key={`${key}-${node.number}`}>{node.title}</div>
        )
      })}
    </>
  )
}

export default () => {
  const { cms: { repository = null } } = useStaticQuery(query);
  const issues: Issues | null = repository ? repository.issues : null;
  return (
    <Basic>
      {issues ? (
        <List {...issues} />
      ) : (
        <ExceptionDiv>
          <div>未知异常，请刷新或稍后重试。</div>
        </ExceptionDiv>
      )}
    </Basic>
  )
}

const query = graphql`
  query issues {
    cms {
      repository(name: "blog", owner: "Coyeah") {
        issues(filterBy: {createdBy: "Coyeah", states: OPEN}, first: 10, orderBy: {field: CREATED_AT, direction: DESC}, after: "Y3Vyc29yOnYyOpK5MjAxOS0wNy0wN1QyMDo1NTo0NCswODowMM4btpK9") {
          nodes {
            title
            number
          }
          totalCount
          edges {
            cursor
          }
        }
      }
    }
  }
`;

interface Issues {
  nodes: { title: string, number: number }[],
  totalCount: number;
  edges: { cursor: string }[]
}