import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle("ConvertApiTos")
    .setDescription("The ConvertApiTos API")
    .setVersion("1.0.0")
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api", app, documentFactory, {
    jsonDocumentUrl: "/swagger.json",
    yamlDocumentUrl: "/swagger.yaml",
    customSiteTitle: "ConvertApiTos API",
  });
};

export default setupSwagger;
