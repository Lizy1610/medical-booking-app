import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { register } from "../../src/lib/auth";

const mock = new MockAdapter(axios);

describe("Pruebas unitarias de Register", () => {
  it("debe registrar un nuevo usuario correctamente", async () => {
    mock.onPost("/api/auth/register").reply(201, {
      message: "Usuario creado",
    });

    const response = await register({
      name: "John Doe",
      username: "johndoe",
      email: "john@example.com",
      password: "password123",
      dateOfBirth: "1990-01-01",
      gender: "Hombre",
    });

    expect(response.message).toBe("Usuario creado");
  });

  it("debe manejar el error cuando el usuario ya existe", async () => {
    mock.onPost("/api/auth/register").reply(409, {
      message: "Correo o usuario ya registrado",
    });

    try {
      await register({
        name: "John Doe",
        username: "johndoe",
        email: "john@example.com",
        password: "password123",
        dateOfBirth: "1990-01-01",
        gender: "Hombre",
      });
    } catch (error: any) {
      expect(error.message).toBe("Correo o usuario ya registrado");
    }
  });
});
