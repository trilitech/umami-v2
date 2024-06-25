import { parseTorusRedirectParams } from ".";

const googleAuthDeeplink =
  "umami://auth/channel=redirect_channel_zorelm9guc&instanceId=zorelm9guc&verifier=umami-email&typeOfLogin=jwt&redirectToOpener=true&access_token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly9rdWthaS5ldS5hdXRoMC5jb20vIn0..Isiag-vr2cBKB29w.hKsMfMUA835G7-kcF60tDo8UZW6Hbkjj9iwUEyqg-2bBMZTiG2DJTq8wNsPFjP2eE_bmjrNw7KI6dLv-LMAeocvWtVCJ13NhuPqZCcZGoD0rlVSV9RPSLaUmv47Gxi08zzZjvCmUntYCSQoPMu4XFyIpauHkQwRqmpM7fdlYPIj7KSeU2opa_rkurlggBFBQ70PSZpyYvTWYexsjeMYUr5YkZSlg3553SbkDOCjkmTg0FEeAXZhBQEBziAE9Gy4bawOG0YoedTAnpHEI3qoNg4z0m26dudIMVbelNjW8s6eWUqUK.o2yHQOTA9RFM7lj5L_fylA&scope=openid%2520profile%2520email&expires_in=7200&token_type=Bearer&state=eyJpbnN0YW5jZUlkIjoiem9yZWxtOWd1YyIsInZlcmlmaWVyIjoidW1hbWktZW1haWwiLCJ0eXBlT2ZMb2dpbiI6Imp3dCIsInJlZGlyZWN0VG9PcGVuZXIiOnRydWV9&id_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InFsZ25uU0F6SWE1SkFRTkdud2dEbCJ9.eyJuaWNrbmFtZSI6InNlcmpvbnlhIiwibmFtZSI6InNlcmpvbnlhQGdtYWlsLmNvbSIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci8yODVhZWQ0MGQ4ZWRjZWNjN2VkNDZiODFiZTQwMjhhYT9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRnNlLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDI0LTA1LTE5VDIyOjQwOjUwLjg4M1oiLCJlbWFpbCI6InNlcmpvbnlhQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2t1a2FpLmV1LmF1dGgwLmNvbS8iLCJhdWQiOiJMVGc2ZlZzYWNhZkdtaHYxNFRabHJXRjFFYXZ3UW9EWiIsImlhdCI6MTcxNjE1ODQ1MSwiZXhwIjoxNzE2MTk0NDUxLCJzdWIiOiJlbWFpbHw2NjRhMzVlNjk0MTU2YzgxNmU5MzRjZDciLCJhdXRoX3RpbWUiOjE3MTYxNTg0NTAsImF0X2hhc2giOiJtQkRMR1drNGxRcnJMeE1pRnFPczRBIiwic2lkIjoiRnI1UkZuTmF0TWw2azA1YlFFUGNwZk1TVmdYU2R4MjUiLCJub25jZSI6InpvcmVsbTlndWMifQ.IaSqav42wd980FvjgWFY0HJf93wfwScnor7ocDV1BSLjYAmsL8cRJDvWs_rzPiduaQqQFTcbUSWY6hqMawY7-oPL5-RkEeqcub8M6UxRU_z_NTWYToZLIszblNbRoK0dybFc3Kq9D-dVsJhwVYmp9VzycD0DbDvQeBwbuA3GB1OxMhiB7n6__APCLSfrDSWQF4_uzg636pEtGMHboxJf8h_CpEYgnpHvMkOVAJjDq3UmPJgUB8-fFkyO2x_Q9E8Sbe-3Wp2F9M3QQ-MGxZiBMPTi0eemPoFySZId9yUGaAWYb2xYv8Ysk2b0Cu3XUcr1awibDjJRvgoJ_AhNmH330Q&full_params=true";

test("parseTorusRedirectParams", () => {
  expect(parseTorusRedirectParams(googleAuthDeeplink)).toEqual({
    channel: "redirect_channel_zorelm9guc",
    data: {
      hashParams: {
        access_token:
          "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly9rdWthaS5ldS5hdXRoMC5jb20vIn0..Isiag-vr2cBKB29w.hKsMfMUA835G7-kcF60tDo8UZW6Hbkjj9iwUEyqg-2bBMZTiG2DJTq8wNsPFjP2eE_bmjrNw7KI6dLv-LMAeocvWtVCJ13NhuPqZCcZGoD0rlVSV9RPSLaUmv47Gxi08zzZjvCmUntYCSQoPMu4XFyIpauHkQwRqmpM7fdlYPIj7KSeU2opa_rkurlggBFBQ70PSZpyYvTWYexsjeMYUr5YkZSlg3553SbkDOCjkmTg0FEeAXZhBQEBziAE9Gy4bawOG0YoedTAnpHEI3qoNg4z0m26dudIMVbelNjW8s6eWUqUK.o2yHQOTA9RFM7lj5L_fylA",
        authuser: null,
        expires_in: "7200",
        hd: null,
        id_token:
          "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InFsZ25uU0F6SWE1SkFRTkdud2dEbCJ9.eyJuaWNrbmFtZSI6InNlcmpvbnlhIiwibmFtZSI6InNlcmpvbnlhQGdtYWlsLmNvbSIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci8yODVhZWQ0MGQ4ZWRjZWNjN2VkNDZiODFiZTQwMjhhYT9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRnNlLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDI0LTA1LTE5VDIyOjQwOjUwLjg4M1oiLCJlbWFpbCI6InNlcmpvbnlhQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2t1a2FpLmV1LmF1dGgwLmNvbS8iLCJhdWQiOiJMVGc2ZlZzYWNhZkdtaHYxNFRabHJXRjFFYXZ3UW9EWiIsImlhdCI6MTcxNjE1ODQ1MSwiZXhwIjoxNzE2MTk0NDUxLCJzdWIiOiJlbWFpbHw2NjRhMzVlNjk0MTU2YzgxNmU5MzRjZDciLCJhdXRoX3RpbWUiOjE3MTYxNTg0NTAsImF0X2hhc2giOiJtQkRMR1drNGxRcnJMeE1pRnFPczRBIiwic2lkIjoiRnI1UkZuTmF0TWw2azA1YlFFUGNwZk1TVmdYU2R4MjUiLCJub25jZSI6InpvcmVsbTlndWMifQ.IaSqav42wd980FvjgWFY0HJf93wfwScnor7ocDV1BSLjYAmsL8cRJDvWs_rzPiduaQqQFTcbUSWY6hqMawY7-oPL5-RkEeqcub8M6UxRU_z_NTWYToZLIszblNbRoK0dybFc3Kq9D-dVsJhwVYmp9VzycD0DbDvQeBwbuA3GB1OxMhiB7n6__APCLSfrDSWQF4_uzg636pEtGMHboxJf8h_CpEYgnpHvMkOVAJjDq3UmPJgUB8-fFkyO2x_Q9E8Sbe-3Wp2F9M3QQ-MGxZiBMPTi0eemPoFySZId9yUGaAWYb2xYv8Ysk2b0Cu3XUcr1awibDjJRvgoJ_AhNmH330Q",
        prompt: null,
        scope: "openid%20profile%20email",
        state:
          "eyJpbnN0YW5jZUlkIjoiem9yZWxtOWd1YyIsInZlcmlmaWVyIjoidW1hbWktZW1haWwiLCJ0eXBlT2ZMb2dpbiI6Imp3dCIsInJlZGlyZWN0VG9PcGVuZXIiOnRydWV9",
        token_type: "Bearer",
      },
      instanceParams: {
        instanceId: "zorelm9guc",
        redirectToOpener: "true",
        typeOfLogin: "jwt",
        verifier: "umami-email",
      },
    },
    error: null,
  });
});