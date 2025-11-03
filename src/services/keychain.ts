import * as Keychain from "react-native-keychain"

class SecureStorageService {
  private readonly serviceName = "com.yourapp.auth"

  async setUserCredentials(
    username: string,
    password: string
  ): Promise<Keychain.Result | false> {
    try {
      return await Keychain.setGenericPassword(username, password, {
        service: this.serviceName,
      })
    } catch (error) {
      console.error("SecureStorage Error: Failed to set credentials.", error)
      throw new Error("Could not securely store user credentials.")
    }
  }

  async getUserCredentials(): Promise<Keychain.UserCredentials | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: this.serviceName,
      })

      if (credentials) {
        return credentials
      }
      return null
    } catch (error) {
      console.error("SecureStorage Error: Failed to get credentials.", error)
      throw new Error("Could not retrieve user credentials.")
    }
  }

  async removeUserCredentials(): Promise<void> {
    try {
      await Keychain.resetGenericPassword({
        service: this.serviceName,
      })
    } catch (error) {
      console.error("SecureStorage Error: Failed to remove credentials.", error)
      throw new Error("Could not remove user credentials.")
    }
  }
}

export const SecureStorage = new SecureStorageService()
