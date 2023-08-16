/* istanbul ignore file */
import { request as graphqlRequest, RequestDocument, Variables } from "graphql-request";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";
export function request<TDocument = any>(
  document: RequestDocument | TypedDocumentNode<TDocument, Variables>,
  variables?: Variables
) {
  return graphqlRequest<TDocument, Variables>("https://graphql.datocms.com/", document, variables, {
    Authorization: "19ab95a257833429647fc25765a06a",
  });
}
