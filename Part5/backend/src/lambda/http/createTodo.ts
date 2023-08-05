import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import "source-map-support/register";
import { createTodo } from "../../businessLogic/todos";
import { CreateTodoRequest } from "../../requests/CreateTodoRequest";
import { createLogger } from "../../utils/logger";

const logger = createLogger("createTodoHandler");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const parsedBody: CreateTodoRequest = JSON.parse(event.body);

      if (parsedBody.name?.length <= 10) {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            error: "name must be longer than 10 character",
          }),
        };
      }

      const todoItem = await createTodo(event);

      logger.info("createdTodo", todoItem);

      return {
        statusCode: 201,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          item: todoItem,
        }),
      };
    } catch (error) {
      logger.error("Error createdTodo", error.message);

      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: "Error createdTodo",
        }),
      };
    }
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
