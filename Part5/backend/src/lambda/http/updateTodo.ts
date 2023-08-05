import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";
import "source-map-support/register";
import { updateTodo } from "../../businessLogic/todos";
import { UpdateTodoRequest } from "../../requests/UpdateTodoRequest";
import { createLogger } from "../../utils/logger";

const logger = createLogger("updateTodoHandler");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const parsedBody: UpdateTodoRequest = JSON.parse(event.body);

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

      const todoId = event.pathParameters.todoId;

      if (!event.body || !todoId) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: "Error updateTodo!",
          }),
        };
      }

      return await updateTodo(event);
    } catch (error) {
      logger.error("Error updateTodo!", error.message);

      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Error updateTodo!",
        }),
      };
    }
  }
);

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
  })
);
