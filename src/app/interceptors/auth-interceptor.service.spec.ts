import {AuthInterceptor} from "./auth-interceptor.service";
import {OktaAuth} from "@okta/okta-auth-js";
import { HttpHandler, HttpRequest } from "@angular/common/http";
import createSpyObj = jasmine.createSpyObj;
import {TestBed} from "@angular/core/testing";
import {OKTA_AUTH} from "@okta/okta-angular";
import {OktaAuthStub} from "../../testing/stubs";

xdescribe('AuthInterceptor', () => {
  let service: AuthInterceptor;
  let oktaAuthService: OktaAuth;
  let httpHandlerMock: HttpHandler;

  beforeEach(() => {
    httpHandlerMock = createSpyObj(['handle']);
    TestBed.configureTestingModule({
      providers: [
        {provide: OKTA_AUTH, useClass: OktaAuthStub},
        AuthInterceptor
      ]
    });
    service = TestBed.inject(AuthInterceptor);
    oktaAuthService = TestBed.inject(OKTA_AUTH);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  xdescribe('intercept', () => {
    it('should not override authorization header if no access token is returned by authorization service', () => {
      spyOn(oktaAuthService, 'getAccessToken').and.returnValue(undefined);
      let httpRequest = new HttpRequest<any>('GET', 'some/url');

      service.intercept(httpRequest, httpHandlerMock);

      expect(oktaAuthService.getAccessToken).toHaveBeenCalled();
      expect(httpRequest.headers.get('Authorization')).toBeNull();
      expect(httpHandlerMock.handle).toHaveBeenCalledWith(httpRequest);
    });

    it('should override authorization header if access token is returned by authorization service', () => {
      const accessToken = "SOME_VALID_TOKEN";
      spyOn(oktaAuthService, 'getAccessToken').and.returnValue(accessToken);
      let httpRequest = new HttpRequest<any>('GET', 'some/url');

      service.intercept(httpRequest, httpHandlerMock);

      expect(oktaAuthService.getAccessToken).toHaveBeenCalled();
      const expectedHttpRequest = httpRequest.clone({
        headers: httpRequest.headers.set('Authorization', `Bearer ${accessToken}`)
      });
      expect(httpHandlerMock.handle).toHaveBeenCalledWith(expectedHttpRequest);
    });
  });
});
