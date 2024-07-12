
import { conectDB } from "../server";
import db from "../config/db";



jest.mock('../config/db')

describe('connectDB', () => {
    it('should handle database connextion error', async () => {
        jest.spyOn(db, 'authenticate')
            .mockRejectedValueOnce(new Error('Hubo un error al conectar a la DB'))
        const consoleSpy = jest.spyOn(console, 'log')

        await conectDB()

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('Hubo un error a la hora de conectar a la DB')
        )

    })
})