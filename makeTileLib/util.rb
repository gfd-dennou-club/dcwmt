# @method mkdir(path: String) -> void
#
# 	@param path (String) : ディレクトリを作成する場所のパス
#
# ディレクトリを作成する
def mkdir(path)
	system("mkdir -p #{path}")
end

# @method throwError(state, comment) -> void
# エラ-処理を行う
def throwError(state, comment)
	if state then
		p comment
		exit
	end
end