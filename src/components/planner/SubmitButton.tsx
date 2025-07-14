interface SubmitButtonProps {
  isLoading: boolean;
}

export function SubmitButton({ isLoading }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-2xl transition duration-200"
      disabled={isLoading}
      onClick={() => console.log("Botão clicado!")} // 👈 Adicione esta linha
    >
      {isLoading ? "Gerando roteiro..." : "Criar Roteiro com IA"}
    </button>
  );
}
