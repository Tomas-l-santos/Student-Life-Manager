import pytest


class TestRegistration:
    def test_register_success(self, auth_service):
        user = auth_service.register_user(
            email="new@example.com",
            username="newuser",
            password="SecurePass1!",
            birthdate="2000-01-01",
        )
        assert user.email == "new@example.com"
        assert user.username == "newuser"
        assert user.user_id is not None

    def test_register_duplicate_email_raises(self, auth_service):
        auth_service.register_user(
            email="dup@example.com",
            username="user1",
            password="SecurePass1!",
            birthdate="2000-01-01",
        )
        with pytest.raises(ValueError, match="Email already exists"):
            auth_service.register_user(
                email="dup@example.com",
                username="user2",
                password="SecurePass1!",
                birthdate="2000-01-01",
            )

    def test_register_invalid_email_raises(self, auth_service):
        with pytest.raises(ValueError, match="Invalid email format"):
            auth_service.register_user(
                email="not-an-email",
                username="user1",
                password="SecurePass1!",
                birthdate="2000-01-01",
            )

    def test_register_short_username_raises(self, auth_service):
        with pytest.raises(ValueError, match="Invalid username"):
            auth_service.register_user(
                email="user@example.com",
                username="ab",
                password="SecurePass1!",
                birthdate="2000-01-01",
            )


class TestPasswordValidation:
    def test_password_too_short(self, auth_service):
        with pytest.raises(ValueError, match="Password too short"):
            auth_service.validate_password("Ab1!")

    def test_password_no_uppercase(self, auth_service):
        with pytest.raises(ValueError, match="Must contain uppercase"):
            auth_service.validate_password("password1!")

    def test_password_no_lowercase(self, auth_service):
        with pytest.raises(ValueError, match="Must contain lowercase"):
            auth_service.validate_password("PASSWORD1!")

    def test_password_no_number(self, auth_service):
        with pytest.raises(ValueError, match="Must contain number"):
            auth_service.validate_password("Password!")

    def test_password_no_special(self, auth_service):
        with pytest.raises(ValueError, match="Must contain special character"):
            auth_service.validate_password("Password1")

    def test_valid_password_passes(self, auth_service):
        # Should not raise
        auth_service.validate_password("SecurePass1!")


class TestLogin:
    def test_login_success(self, auth_service, registered_user):
        user = auth_service.login_user("test@example.com", "SecurePass1!")
        assert user.email == "test@example.com"

    def test_login_wrong_password_raises(self, auth_service, registered_user):
        with pytest.raises(ValueError, match="Invalid email or password"):
            auth_service.login_user("test@example.com", "WrongPass1!")

    def test_login_unknown_email_raises(self, auth_service):
        with pytest.raises(ValueError, match="Invalid email or password"):
            auth_service.login_user("nobody@example.com", "SecurePass1!")


class TestAccountLockout:
    def test_lockout_after_five_failures(self, auth_service, registered_user):
        for _ in range(5):
            try:
                auth_service.login_user("test@example.com", "WrongPass!")
            except ValueError:
                pass

        with pytest.raises(ValueError, match="Account locked"):
            auth_service.login_user("test@example.com", "WrongPass!")

    def test_lockout_clears_on_success(self, auth_service, registered_user):
        # 4 failures — not yet locked
        for _ in range(4):
            try:
                auth_service.login_user("test@example.com", "WrongPass!")
            except ValueError:
                pass

        # Successful login clears counter
        user = auth_service.login_user("test@example.com", "SecurePass1!")
        assert user is not None

        # Should not be locked now
        user2 = auth_service.login_user("test@example.com", "SecurePass1!")
        assert user2 is not None


class TestOTPReset:
    def test_generate_token_returns_6_digits(self, auth_service, registered_user):
        token = auth_service.generate_reset_token("test@example.com")
        assert len(token) == 6
        assert token.isdigit()

    def test_verify_valid_token(self, auth_service, registered_user):
        token = auth_service.generate_reset_token("test@example.com")
        email = auth_service.verify_reset_token(token)
        assert email == "test@example.com"

    def test_verify_invalid_token_raises(self, auth_service):
        with pytest.raises(ValueError, match="Invalid or expired OTP"):
            auth_service.verify_reset_token("000000")

    def test_reset_password_with_valid_token(self, auth_service, registered_user):
        token = auth_service.generate_reset_token("test@example.com")
        auth_service.reset_password_with_token(token, "NewSecure1!")
        # Token should be consumed — verify it's gone
        with pytest.raises(ValueError, match="Invalid or expired OTP"):
            auth_service.verify_reset_token(token)

    def test_reset_token_unknown_email_raises(self, auth_service):
        with pytest.raises(ValueError, match="User not found"):
            auth_service.generate_reset_token("nobody@example.com")


class TestAPIEndpoints:
    def test_register_endpoint_returns_201(self, client):
        res = client.post(
            "/api/auth/register",
            json={
                "email": "api@example.com",
                "username": "apiuser",
                "password": "SecurePass1!",
                "birthdate": "2000-01-01",
            },
        )
        assert res.status_code == 201
        data = res.get_json()
        assert "access_token" in data
        assert data["user"]["email"] == "api@example.com"

    def test_login_endpoint_returns_200(self, client):
        client.post(
            "/api/auth/register",
            json={
                "email": "login@example.com",
                "username": "loginuser",
                "password": "SecurePass1!",
                "birthdate": "2000-01-01",
            },
        )
        res = client.post(
            "/api/auth/login",
            json={"email": "login@example.com", "password": "SecurePass1!"},
        )
        assert res.status_code == 200
        assert "access_token" in res.get_json()

    def test_protected_route_without_token_returns_401(self, client):
        res = client.get("/api/transactions")
        assert res.status_code == 401

    def test_protected_route_with_token_returns_200(self, client, auth_headers):
        res = client.get("/api/transactions", headers=auth_headers)
        assert res.status_code == 200

    def test_register_missing_fields_returns_400(self, client):
        res = client.post(
            "/api/auth/register",
            json={"email": "incomplete@example.com"},
        )
        assert res.status_code == 400
