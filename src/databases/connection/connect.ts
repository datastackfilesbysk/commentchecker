import * as vscode from "vscode";
import { Client } from "pg";

let isConnected: boolean = false;

async function createClient(): Promise<Client | null> {
  const connectionString = process.env.PG_CONNECTION_STRING;
  if (!connectionString) {
    vscode.window.showErrorMessage(
      "PostgreSQL connection string is not set in environment variables."
    );
    return null;
  }

  const newClient = new Client({
    connectionString: connectionString,
  });
  return newClient;
}

export async function connectToPostgres() {
  let client: Client | null = null;
  try {
    client = await createClient();
    if (client) {
      client.connect();
      isConnected = true;
      vscode.window.showInformationMessage(
        "Initial connection to PostgreSQL database successful."
      );
    }
  } catch (error: any) {
    isConnected = false;
    vscode.window.showErrorMessage(
      "Failed to connect to PostgreSQL database: " +
        (error instanceof Error ? error.message : String(error))
    );
  }
  return client;
}
