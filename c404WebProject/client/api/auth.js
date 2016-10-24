/**
 * API Auth static class
 */
export default class ApiAuth
{
    static login(action)
    {
        let response = [];

        // Mock
        return {
            status: (action.username === "alice" && action.password === "123456")
        }
    }

	static signup(action)
	{
		let response = [];

		// Mock
		return {
			status: 1
		}
	}

    static logout(action)
    {
        let response = [];

        // Mock
        return {
            status: 0
        }
    }
}
