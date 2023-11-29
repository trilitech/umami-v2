/* istanbul ignore file */
// eslint-disable-next-line import/no-unresolved
import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { RequestDocument, Variables, request as graphqlRequest } from "graphql-request";
export function request<TDocument = any>(
  document: RequestDocument | TypedDocumentNode<TDocument, Variables>,
  variables?: Variables
) {
  return graphqlRequest<TDocument, Variables>("https://graphql.datocms.com/", document, variables, {
    Authorization: "19ab95a257833429647fc25765a06a",
  });
}
