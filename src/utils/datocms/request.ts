import {
  request as graphqlRequest,
  RequestDocument,
  Variables,
} from "graphql-request";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";
export function request<TDocument = any>(
  document: RequestDocument | TypedDocumentNode<TDocument, Variables>,
  variables?: Variables
) {
  return graphqlRequest<TDocument, Variables>(
    "https://graphql.datocms.com/",
    document,
    variables,
    {
      Authorization: "66f8fd58737009e8f77cb7a31688ab",
    }
  );
}
