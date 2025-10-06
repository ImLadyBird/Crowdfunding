const AuthToggle = ({ isSignUp, onToggle }) => (
  <div className="text-center mt-4">
    <button
      onClick={onToggle}
      className="text-sm text-blue-600 hover:underline"
    >
      {isSignUp
        ? "Already have an account? Sign In"
        : "Don't have an account? Sign Up"}
    </button>
  </div>
);

export default AuthToggle