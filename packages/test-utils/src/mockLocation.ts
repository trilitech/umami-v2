export const mockLocation = () => {

    delete (window as any).location;
    return {
        reload: jest.fn(),
    };
};
